import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
} from '@coreui/react'
import useForm from 'src/Hooks/useForm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css'
import NlmtDieselCreationOwn from './segments/Own/NlmtDieselCreationOwn'
import NlmtDieselCreationHire from './segments/Hire/NlmtDieselCreationHire'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import DieselIntentValidation from 'src/Utils/DieselIntent/DieselIntentValidation'
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService'
import NlmtDieselIntentCreationService from 'src/Service/Nlmt/DieselIntent/NlmtDieselIntentCreationService'
import NlmtDieselIntentValidation from 'src/Utils/Nlmt/DieselIntent/NlmtDieselIntentValidation'

const NlmtDieselIntent = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json || '{}')
  const user_id = user_info?.user_id

  const { id } = useParams()
  const navigation = useNavigate()

  const [singleVehicleInfo, setSingleVehicleInfo] = useState(null)
  const [fetch, setFetch] = useState(false)
const [acceptBtn, setAcceptBtn] = useState(false)

  const [confirmBtn, setConfirmBtn] = useState(false)

  const vehicleType = {
    OWN: 21,
    HIRE: 22,
    PARTY: 23,
  }

  const formValues = {
    vehicle_id: '',
    vendor_code: '',
    invoice_no: '',
    invoice_copy: '',
    no_of_ltrs: '',
    total_amount: '',
    bunk_reading: '',
    diesel_intent_po_no: '',
    diesel_status: '',
    remarks: '',
    frpt: '',
    diesel_vendor_name: '',
  }

  // ---------------- SAFE HELPERS ----------------

  const getVehicleTypeId = () => {
    return (
      singleVehicleInfo?.vehicle_type_id?.id ??
      singleVehicleInfo?.vehicle_type_id ??
      singleVehicleInfo?.vehicle_info?.vehicle_type_id ??
      0
    )
  }

  const getTripSheetInfo = () => {
    return singleVehicleInfo?.tripsheet_info || {}
  }

  // ---------------- SUBMIT ----------------

  const submitDiesel = (status, sapTripsheet = '') => {
    const data = new FormData()

    data.append('parking_id', values.parking_id)
    data.append('vehicle_id', values.vehicle_id)
    data.append('diesel_vendor_id', values.diesel_vendor_name)
    data.append('driver_id', values.driver_id)
    data.append('tripsheet_id', values.tripsheet_id)
    data.append('vendor_code', values.vendor_code)
    data.append('no_of_ltrs', values.no_of_ltrs || '')
    data.append('total_amount', values.total_amount || '')
    data.append('remarks', values.remarks)
    data.append('created_by', user_id)
    data.append('diesel_status', status)

    if (sapTripsheet) {
      data.append('sap_flag', '0')
      data.append('sap_tripsheet', sapTripsheet)
    }

    NlmtDieselIntentCreationService.createDiesel(data)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Diesel Intent Created Successfully!')
          navigation('/NlmtDieselIntentHome')
        } else if (res.status === 202) {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('Something went wrong')
      })
  }

  const CreateDieselIntent = (status) => {
    const vehicleTypeId = getVehicleTypeId()
    const tripSheet = getTripSheetInfo()

    if (!tripSheet) {
      toast.error('Trip sheet info missing')
      return
    }

    if (
      vehicleTypeId < 22 &&
      (tripSheet?.sap_flag == '1' || tripSheet?.sap_flag == '2')
    ) {
      if (Number(values.total_amount) < Number(values.advance_payment_diesel)) {
        toast.warning('Please Check The Diesel Amount')
        return
      }

      if (!values.vendor_code) {
        toast.warning('Please Check The Vendor Code')
        return
      }

      const SAPData = new FormData()
      SAPData.append('TRIP_SHEET', tripSheet?.nlmt_tripsheet_no || '')
      SAPData.append('VEHICLE_NO', singleVehicleInfo?.vehicle_number || '')
      SAPData.append('VEHICLE_TYPE', vehicleTypeId)
      SAPData.append(
        'DRIVER_NAME',
        singleVehicleInfo?.driver_info?.driver_name || ''
      )
      SAPData.append(
        'DRIVER_CODE',
        singleVehicleInfo?.driver_info?.driver_code || ''
      )
      SAPData.append(
        'DRIVER_PH_NO',
        singleVehicleInfo?.driver_info?.driver_phone_1 || ''
      )

      TripSheetInfoService.StartTSInfoToSAP(SAPData).then((response) => {
        if (response?.data?.[0]?.STATUS != 1) {
          toast.warning(
            'There is a Problem to send Tripsheet Number to SAP.'
          )
          return
        }

        submitDiesel(status, response?.data?.[0]?.TRIP_SHEET)
      })
    } else {
      submitDiesel(status)
    }
  }

  const {
    values,
    errors,
    handleChange,
    onFocus,
    handleSubmit,
    onBlur,
    isTouched,
  } = useForm(CreateDieselIntent, NlmtDieselIntentValidation, formValues)
useEffect(() => {
  if (Object.keys(errors).length === 0) {
    setAcceptBtn(false)
  } else {
    setAcceptBtn(true)
  }
}, [errors])
  // ---------------- FETCH ----------------

  useEffect(() => {
    setFetch(false)
    NlmtDieselIntentCreationService.getSingleVehicleInfoOnGate(id)
      .then((res) => {
        setFetch(true)
        const data = res?.data?.data
        if (!data) return

        setSingleVehicleInfo(data)

        values.tripsheet_id = data?.tripsheet_id ?? ''
        values.trip_sheet_no = data?.tripsheet_info?.nlmt_tripsheet_no ?? ''
        values.driver_code = data?.driver_info?.driver_code ?? ''
        values.advance_amount = data?.tripsheet_info?.advance_amount ?? 0
        values.advance_payment_diesel =
          data?.tripsheet_info?.advance_payment_diesel ?? 0
        values.total_amount =
          data?.tripsheet_info?.advance_payment_diesel ?? 0
        values.frpt =
          data?.tripsheet_info?.freight_rate_per_tone ?? 0
        values.vehicle_type_id =
          data?.vehicle_type_id?.id ??
          data?.vehicle_type_id ??
          data?.vehicle_info?.vehicle_type_id ??
          ''
        values.vehicle_id = data?.vehicle_id ?? ''
        values.parking_id = data?.nlmt_trip_in_id ?? ''
        values.driver_id = data?.driver_id ?? ''
      })
      .catch(() => {
        setFetch(true)
      })
  }, [id])

  // ---------------- LOADER ----------------

  if (!fetch) return <Loader />
  if (!singleVehicleInfo || !singleVehicleInfo.tripsheet_info)
    return <Loader />
  const vehicleTypeId = getVehicleTypeId()

  return (
    <>
      <CCard>
        <CForm className="container p-3" onSubmit={handleSubmit}>
          {vehicleTypeId === vehicleType.OWN ? (
            <NlmtDieselCreationOwn
              values={values}
              errors={errors}
              handleChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              singleVehicleInfo={singleVehicleInfo}
              isTouched={isTouched}
            />
          ) : (
            <NlmtDieselCreationHire
              values={values}
              errors={errors}
              handleChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              singleVehicleInfo={singleVehicleInfo}
            />
          )}

          <CRow className="mt-md-3">
            <CCol xs={12} sm={12} md={3}>
              <CButton size="sm" color="primary" className="text-white">
                <Link className="text-white" to="/DieselIntentHome">
                  Previous
                </Link>
              </CButton>
            </CCol>

            <CCol
              className="offset-md-6"
              xs={12}
              sm={12}
              md={3}
              style={{ display: 'flex', justifyContent: 'end' }}
            >
              {vehicleTypeId === vehicleType.OWN ? (
                <CButton
                  size="sm"
                  color="warning"
                  className="mx-3 px-3 text-white"
                  disabled={acceptBtn}
                  onClick={() => setConfirmBtn(true)}
                >
                  Submit
                </CButton>
              ) : (
                <CButton
                  size="sm"
                  color="warning"
                  className="mx-3 px-3 text-white"
                  disabled={acceptBtn}
                  onClick={() => CreateDieselIntent(1)}
                >
                  Submit
                </CButton>
              )}
            </CCol>
          </CRow>
        </CForm>
      </CCard>

      <CModal visible={confirmBtn} onClose={() => setConfirmBtn(false)}>
        <CModalBody>
          <p className="lead">Are You sure To Create Diesel Intent?</p>
          <b style={{ color: 'red' }}>
            Note: If diesel intent is created, you cannot create RJ Sale Order for
            this tripsheet.
          </b>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setConfirmBtn(false)}>
            No
          </CButton>
          <CButton
            color="warning"
            onClick={() => {
              setConfirmBtn(false)
              CreateDieselIntent(1)
            }}
          >
            Yes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default NlmtDieselIntent
