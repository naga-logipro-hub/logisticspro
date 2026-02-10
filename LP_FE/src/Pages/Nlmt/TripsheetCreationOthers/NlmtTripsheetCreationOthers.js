/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTabContent,
  CTabPane,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from 'src/components/Loader'
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify'
import useForm from 'src/Hooks/useForm'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'

import NlmtTSCreationService from 'src/Service/Nlmt/TSCreation/NlmtTSCreationService'
import NlmtVehicleMasterService from 'src/Service/Nlmt/Masters/NlmtVehicleMasterService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import VendorAvaiable from 'src/Pages/DocumentVerification/Segments/VendorAvaiable'
import OthersVendorNotAvailable from 'src/Pages/DocumentVerification/Segments/OthersVendorNotAvailable'
import PanDataService from 'src/Service/SAP/PanDataService'
import NlmtRouteMasterService from 'src/Service/Nlmt/Masters/NlmtRouteMasterService'
import AdvanceRequest from 'src/Pages/AdvanceRequestCreation/AdvanceRequest'
import NlmtVendorRequestService from 'src/Service/Nlmt/VendorRequest/NlmtVendorRequestService'
import NlmtTripInService from 'src/Service/Nlmt/TripIn/NlmtTripInService'
import NlmtShedListSearchSelect from '../Master/Component/NlmtShedListSearchSelect'
import NlmtShedMasterService from 'src/Service/Nlmt/Masters/NlmtShedMasterService'

const HIRE_ID = 22
const PARTY_ID = 23

const NlmtTripsheetCreationOthers = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  /* Get User Locations From Local Storage */
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const user_id = user_info.user_id
  /*================== User Location Fetch ======================*/

  /* Get User Locations From Local Storage */
  const user_location_info = user_info.location_info
  var user_locations_id = ''
  user_location_info.map((data, index) => {
    user_locations_id = user_locations_id + data.id + ','
  })
  var lastIndex = user_locations_id.lastIndexOf(',')

  const userLocation = user_locations_id.substring(0, lastIndex)

  const formValues = {
    vehicle_type: '',
    vehicleId: '',
    vehicleNumber: '',
    vehicleCapacity: '',
    vehicleBodyType: '',
    driverName: '',
    driverMobile1: '',
    panNumber: '',
    ownerName: '',
    ownerMob: '',
    aadhar: '',
    bankAcc: '',
    expected_delivery_date: '',
    remarks: '',
    tripRoute: '',
    freightRate: '',
    advanceRequest: '',
    shedName: '',
  }

  const { errors, values, setValues, handleChange, handleSubmit, onFocus, onBlur, handleChangeOTS } =
    useForm(() => { }, VehicleInspectionValidation, formValues)

  const [loading, setLoading] = useState(true)
  const [vehicleTypeList, setVehicleTypeList] = useState([])
  const [capacityList, setCapacityList] = useState([])
  const [bodyTypeList, setBodyTypeList] = useState([])
  const [typedVehicleNo, setTypedVehicleNo] = useState('')
  const [isExistingVehicle, setIsExistingVehicle] = useState(false)
  const [rejectConfirm, setRejectConfirm] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [panData, setPanData] = useState({})
  const [panNumbernew, setpanNumber] = useState('')
  const [vendor, setVendor] = useState(false)
  const [freightRate, setFreightRate] = useState('')
  const [routeLoading, setRouteLoading] = useState(false)
  const [tripRouteList, setTripRouteList] = useState([])
  const [advanceLimit, setadvanceLimit] = useState([])
  const [shedMob, setShedMob] = useState('')
  const [shedWhats, setShedWhats] = useState('')
  const [shed_Name1, setShed_Name1] = useState('')
  const [originalVehicleConfig, setOriginalVehicleConfig] = useState({
    vehicle_capacity_id: '',
    vehicle_body_type_id: '',
  })

  const [advanceReqList, setadvanceReqList] = useState([
    { id: 1, name: 'Yes' },
    { id: 0, name: 'No' },
  ])

  const REQ = () => <span className="text-danger"> *</span>

  const handleChangenewpan = (event) => {
    let panResult = event.target.value.toUpperCase()
    var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
    if (panResult.trim() === '') errors.panNumber = 'Required'
    else if (!regpan.test(panResult)) errors.panNumber = 'Invalid Pan Format (Ex:ABCDE1234F)'
    else errors.panNumber = ''
    setpanNumber(panResult)
    setPanData({})
  }

  useEffect(() => {
    setValues((prev) => ({
      vehicle_type: prev.vehicle_type,
      vehicle_number: prev.vehicle_number,
      vehicleId: '',
      vehicleNumber: '',
      vehicleCapacity: '',
      vehicleBodyType: '',
      vehicle_capacity_id: '',
      vehicle_body_type_id: '',
      driverName: '',
      driverMobile1: '',
      panNumber: '',
      ownerName: '',
      ownerMob: '',
      aadhar: '',
      bankAcc: '',
      expected_delivery_date: '',
      remarks: '',
      tripRoute: '',
      freightRate: '',
      advanceRequest: '',
      shedMob: '',
      shedWhats: '',
      shedName: '',

    }));
    setTypedVehicleNo('');
    setIsExistingVehicle(false);
    setPanData({});
    setpanNumber('');
    setVendor(false);
  }, [values.vehicle_type, values.vehicle_number]);



  useEffect(() => {
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2)
      .then((res) => {
        const list = res?.data?.data || []

        const sortedList = [...list].sort(
          (a, b) => Number(a.definition_list_name) - Number(b.definition_list_name)
        )

        setCapacityList(sortedList)
      })
      .catch(() => setCapacityList([]))
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1)
      .then((res) => setBodyTypeList(res?.data?.data || []))
      .catch(() => setBodyTypeList([]))
    NlmtRouteMasterService.getNlmtRoutes()
      .then((res) => setTripRouteList(res?.data?.data || []))
      .catch(() => setTripRouteList([]))
    NlmtVehicleMasterService.getNlmtOtherVehicleType()
      .then((res) => setVehicleTypeList(res?.data?.data || []))
      .finally(() => setLoading(false))
  }, [])
  console.log(advanceLimit, 'advanceLimit')
  //const [advanceLimit, setadvanceLimit] = useState([])
  const onChange = (event) => {
    let shedId = event.value
    console.log(shedId, 'shedId')
    if (shedId != '') {
      values.shedName = shedId

      NlmtShedMasterService.getShedById(shedId).then((res) => {
        console.log(res.data.data)
        setShedMob(res.data.data.shed_owner_phone_1)
        setShedWhats(res.data.data.shed_owner_phone_2)
        setShed_Name1(res.data.data.shed_name)
        errors.shedName = ''
      })
      console.log(setShed_Name1)
    } else {
      values.shedName = ''
      setShedMob('')
      setShedWhats('')
      errors.shedName = 'Required'
      // console.log()
    }
  }

  const getPanData = (e) => {
    e.preventDefault()
    PanDataService.getPanData(panNumbernew).then((res) => {
      if (res.status === 200 && res.data.length > 0) {
        setVendor(true)
        setPanData(res.data[0])
        toast.success('PAN Details Detected!')
      } else {
        setVendor(false)
        toast.warning('No PAN Details Detected! Fill Up The Fields')
      }
    })
  }
  useEffect(() => {
    if (!values.tripRoute) {
      setFreightRate('')
      return
    }

    setRouteLoading(true)

    NlmtRouteMasterService.getNlmtRouteById(values.tripRoute)
      .then((res) => {
        const data = res?.data?.data
        setFreightRate(String(data?.freight_rate || ''))
      })
      .catch(() => {
        toast.error('Failed to load freight rate')
        setFreightRate('')
      })
      .finally(() => setRouteLoading(false))
  }, [values.tripRoute])

  useEffect(() => {
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(4)
      .then((res) => setadvanceLimit(res?.data?.data || []))
      .catch(() => setadvanceLimit([]))
  }, [])

  const advancePercentage =
    advanceLimit?.find((item) => item.definition_list_status === 1)
      ?.definition_list_name || 0

const advanceEligible =
  values.advanceRequest === '1' &&
  values.vehicleCapacity &&
  freightRate
    ? (
        (Number(values.vehicleCapacity) * Number(freightRate) * Number(advancePercentage)) / 100
      ).toFixed(2)
    : '';
  console.log("panData:", panData)
  // Vehicle Create & Update - Vendor Creation Pending Start
  const handleCreateClick = async () => {
    try {
      let vehicleId = values.vehicleId;

      /* ===============================
         1️⃣ CREATE VEHICLE (NEW)
      =============================== */
      if (!isExistingVehicle && !vehicleId) {
        const vehiclePayload = {
          vehicle_type_id: values.vehicle_type,
          vehicle_number: values.vehicleNumber,
          vehicle_capacity_id: values.vehicle_capacity_id,
          vehicle_body_type_id: values.vehicle_body_type_id,
          created_by: user_id,
        };

        const vehicleRes =
          await NlmtVehicleMasterService.createNlmtVehicles(vehiclePayload);

        if (!vehicleRes) {
          toast.error("Vehicle creation failed");
          return;
        }

        // ✅ CORRECT EXTRACTION
        vehicleId = vehicleRes?.data?.data?.vehicle_id;

        if (!vehicleId) {
          console.error("Vehicle create response:", vehicleRes);
          toast.error("Vehicle ID not generated");
          return;
        }

        // store for later usage
        setValues((prev) => ({ ...prev, vehicleId }));

        toast.success("Vehicle Created Successfully");
      }

      /* ===============================
         2️⃣ UPDATE VEHICLE (EXISTING)
      =============================== */
      if (isExistingVehicle && vehicleId) {
        const capacityChanged =
          originalVehicleConfig.vehicle_capacity_id !== values.vehicle_capacity_id;
        const bodyTypeChanged =
          originalVehicleConfig.vehicle_body_type_id !== values.vehicle_body_type_id;

        if (capacityChanged || bodyTypeChanged) {
          await NlmtVehicleMasterService.updateNlmtVehicles(vehicleId, {
            vehicle_capacity_id: values.vehicle_capacity_id,
            vehicle_body_type_id: values.vehicle_body_type_id,
            updated_by: user_id,
          });

          toast.success("Vehicle Updated Successfully");
        }
      }

      /* ===============================
         3️⃣ TRIP-IN → parking_id
      =============================== */
      if (!vehicleId) {
        toast.error("vehicleId missing before Trip-In");
        return;
      }

      const tripRes = await NlmtTripInService.handleTripInAction({
        vehicle_id: vehicleId,
        driver_id: values.driverId || null,
        driver_name: values.driverName,     // ✅ nullable bcoz Stored driver Name
        advance_request: values.advanceRequest,
        driver_phone_1: values.driverMobile1,    // ✅ nullable values.driverMobile1
        vehicle_inspection_id: null,
        vehicle_location_id: userLocation,            // ✅ nullable bcoz not VI
        created_by: user_id,
        vehicle_current_position: 16,
        parking_status: 1,
        tripsheet_open_status: 0,
      });
      console.log("Trip-In Response:", tripRes);

      const parking_id = tripRes?.data?.data?.nlmt_trip_in_id;
      console.log("Trip-In parking_id:", parking_id);
      if (!parking_id) {
        toast.error("parking_id not generated");
        return;
      }

      /* =============================== Hire Vendor Request  =============================== */


      if (
        values.vehicle_type == 22 &&
        values.ownerName &&
        values.ownerMob &&
        values.aadhar &&
        values.bankAcc
      ) {
        console.log("Vendor Response:")
        const vendorRes = await NlmtVendorRequestService.createNlmtVendorRequest({
          shed_id: values.shedName,          // ✅ REQUIRED
          parking_id: parking_id,
          vehicle_id: vehicleId,
          owner_name: values.ownerName,
          owner_number: values.ownerMob,    // ✅ correct column
          pan_card_number: panNumbernew,
          aadhar_card_number: values.aadhar,
          bank_acc_number: values.bankAcc,
          vendor_status: 1,
          created_by: user_id,
        });
        console.log("Vendor Response:", vendorRes)

        toast.success("Vendor Request Submitted Successfully");
      }

      if (values.vehicle_type == 22 && panData.NAME1) {
        const vendorRes = await NlmtVendorRequestService.createNlmtVendorRequest({
          parking_id: parking_id,
          vehicle_id: vehicleId,
          vendor_code: panData.LIFNR,
          owner_name: panData.NAME1,
          owner_name2: panData.NAME2,
          owner_number: panData.TELF1,
          aadhar_card_number: panData.IDNUMBER,
          bank_acc_number: panData.BANKN,
          city: panData.CITY,
          pan_card_number: panData.J_1IPANNO,
          shed_id: values.shedName,
          vendor_status: 0,
          created_by: user_id,

        });
        console.log("Vendor Response:", vendorRes)

        toast.success("Vendor Request Submitted Successfully");
      }

      /* ===============================
         5️⃣ CREATE TRIPSHEET
      =============================== */
      const tsRes = await createTripsheet({
        status: 1,
        vehicleId,
        parking_id,
      })
      if (tsRes?.message === 'Tripsheet Creation Completed') {
        Swal.fire({
          title: 'NLMT TripSheet Created Successfully!',
          icon: 'success',
          text: `TripSheet No : ${tsRes.nlmt_tripsheet_no}`,
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.reload();   // ✅ refresh window
          //navigate('/NlmtTripsheetCreationOthers') // ✅ redirect works
        })
      }
    } catch (error) {
      console.error("handleCreateClick error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };







  // Vehicle Create & Update - Vendor Creation Pending End

  const createTripsheet = async ({ status, vehicleId, parking_id }) => {
    if (!vehicleId || !parking_id) {
      throw new Error("vehicleId or parking_id missing for Tripsheet");
    }

    const data = new FormData();

    data.append("vehicle_type", values.vehicle_type);
    data.append("vehicle_id", vehicleId);
    data.append("parking_id", parking_id);
  data.append("route_id", values.tripRoute);
    // data.append("shed_id", values.shedName);
    data.append("vehicle_number", values.vehicleNumber);
    data.append("vehicle_capacity_id", values.vehicle_capacity_id);
    data.append("vehicle_body_type_id", values.vehicle_body_type_id);
    data.append("advance_request", values.advanceRequest);
    data.append("expected_delivery_date", values.expected_delivery_date);
    data.append("remarks", values.remarks);
    data.append("status", status);
    data.append("created_by", user_id);

    data.append("driverName", values.driverName);
    data.append("driverMobile1", values.driverMobile1);
    data.append("panNumber", panNumbernew);
    data.append("ownerName", values.ownerName);
    data.append("ownerMobile", values.ownerMob);
    data.append("aadharNumber", values.aadhar);
    data.append("bankAccountNumber", values.bankAcc);
    data.append("advanceRequest", values.advanceRequest);
    data.append("tripRoute", values.tripRoute || "");

    const res = await NlmtTSCreationService.handleTripsheetCreationAction(data);
    return res.data;
  };






  if (loading) return <Loader />

  const isHire = values.vehicle_type == HIRE_ID
  const isParty = values.vehicle_type == PARTY_ID

  return (
    <>
      <CCard>
        <CTabContent>
          <CTabPane visible>
            <CForm onSubmit={handleSubmit} className="p-3">
              <CRow className="mt-3">
                {/* VEHICLE TYPE */}
                <CCol md={3}>
                  <CFormLabel>Vehicle Type  <REQ />{' '}
                    {errors.vehicle_type && <span className="text-danger">{errors.vehicle_type}</span>}
                  </CFormLabel>
                  <CFormSelect size="sm" name="vehicle_type" value={values.vehicle_type} onChange={handleChange}>
                    <option value="">Select</option>
                    {vehicleTypeList.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>


                {(isHire || isParty) && (
                  <CCol md={3}>
                    <CFormLabel>Vehicle Number <REQ />{' '}
                      {errors.vehicleNumber && <span className="text-danger">{errors.vehicleNumber}</span>}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      placeholder="Enter Vehicle Number"
                      value={typedVehicleNo}
                      onChange={(e) => {
                        const vNo = e.target.value.toUpperCase()
                        setTypedVehicleNo(vNo)
                        setValues((prev) => ({ ...prev, vehicleNumber: vNo }))
                        if (isHire && isParty) setIsExistingVehicle(false)
                      }}
                      onBlur={async () => {
                        if (!typedVehicleNo) return

                        try {
                          const res = await NlmtVehicleMasterService.getNlmtHireVehicleCheck(typedVehicleNo)

                          if (res?.data?.exists) {
                            const v = res.data.data
                            console.log(v, 'vehicle data')

                            if (Number(v.vehicle_is_assigned) === 1) {
                              console.log(v.id, 'v.id')
                              const tripRes = await NlmtTripInService.getTripInOpenTrucks(v.id)
                              console.log(tripRes, 'tripRes')
                              const tripData = tripRes?.data?.data
                              const tripsheetNo = tripData?.nlmt_tripsheet_no || 'N/A'
                              console.log(tripData, 'tripData')
                              console.log(tripsheetNo, 'tripsheetNo')
                              await Swal.fire({
                                title: 'Vehicle Already Assigned',
                                html: `<p><b>TripSheet No:</b> ${tripsheetNo}</p>`,
                                icon: 'warning',
                                confirmButtonText: 'OK',
                              })

                              window.location.reload()
                              return
                            }

                            // ✅ Existing but NOT assigned
                            setIsExistingVehicle(true)
                            setOriginalVehicleConfig({
                              vehicle_capacity_id: String(v.vehicle_capacity_id),
                              vehicle_body_type_id: String(v.vehicle_body_type_id),
                            })

                            setValues((prev) => ({
                              ...prev,
                              vehicleId: v.id,
                              vehicleCapacity: v.vehicle_capacity_info?.def_list_name || '',
                              vehicleBodyType: v.vehicle_body_type_info?.def_list_name || '',
                              vehicle_capacity_id: String(v.vehicle_capacity_id),
                              vehicle_body_type_id: String(v.vehicle_body_type_id),
                            }))
                          } else {
                            // ❌ New vehicle
                            setIsExistingVehicle(false)
                            setOriginalVehicleConfig({
                              vehicle_capacity_id: '',
                              vehicle_body_type_id: '',
                            })

                            setValues((prev) => ({
                              ...prev,
                              vehicleId: '',
                              vehicleCapacity: '',
                              vehicleBodyType: '',
                              vehicle_capacity_id: '',
                              vehicle_body_type_id: '',
                            }))
                          }
                        } catch (error) {
                          console.error('Vehicle check failed:', error)
                          toast.error('Failed to verify vehicle')
                        }
                      }}

                    />
                  </CCol>
                )}

                {/* VEHICLE CAPACITY */}
                {(isHire || isParty) && (
                  <CCol md={3}>
                    <CFormLabel>
                      Vehicle Capacity <REQ />{' '}
                      {errors.vehicleCapacity && <span className="text-danger">{errors.vehicleCapacity}</span>}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="vehicle_capacity_id"
                      value={values.vehicle_capacity_id}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          vehicle_capacity_id: e.target.value,
                          vehicleCapacity:
                            capacityList.find(
                              (c) => String(c.definition_list_id) === e.target.value
                            )?.definition_list_name || '',
                        }))
                      }
                    >
                      <option value="">Select Vehicle Capacity</option>
                      {capacityList.map(({ definition_list_id, definition_list_name }) => (
                        <option key={definition_list_id} value={String(definition_list_id)}>
                          {definition_list_name}
                        </option>
                      ))}
                    </CFormSelect>

                  </CCol>
                )}

                {/* VEHICLE BODY TYPE */}
                {(isHire || isParty) && (
                  <CCol md={3}>
                    <CFormLabel>
                      Vehicle Body Type <REQ />{' '}
                      {errors.vehicleBodyType && <span className="text-danger">{errors.vehicleBodyType}</span>}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="vehicle_body_type_id"
                      value={values.vehicle_body_type_id}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          vehicle_body_type_id: e.target.value,
                          vehicleBodyType:
                            bodyTypeList.find(
                              (b) => String(b.definition_list_id) === e.target.value
                            )?.definition_list_name || '',
                        }))
                      }
                    >
                      <option value="">Select Vehicle Body Type</option>
                      {bodyTypeList.map(({ definition_list_id, definition_list_name }) => (
                        <option key={definition_list_id} value={String(definition_list_id)}>
                          {definition_list_name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                )}

              </CRow>
              <CRow className="mt-3">
                {values.vehicle_type && (
                  <>

                    {/* DRIVER NAME */}
                    <CCol md={3}>
                      <CFormLabel>
                        Driver Name <REQ /> {errors.driverName && <span className="text-danger">{errors.driverName}</span>}
                      </CFormLabel>
                      <CFormInput name="driverName" value={values.driverName} onChange={handleChange} />
                    </CCol>

                    {/* DRIVER MOBILE */}
                    <CCol md={3}>
                      <CFormLabel>
                        Driver Mobile Number <REQ />{' '}
                        {errors.driverMobile1 && <span className="text-danger">{errors.driverMobile1}</span>}
                      </CFormLabel>
                      <CFormInput type="tel"
                        maxLength="10" name="driverMobile1" value={values.driverMobile1} placeholder="Enter Mobile Number" onChange={handleChange} />
                    </CCol>

                    {/* PAN for Hire only */}
                    {isHire && (
                      <CCol md={3}>
                        <CFormLabel>
                          PAN Card Number <REQ /> {errors.panNumber && <span className="text-danger">{errors.panNumber}</span>}
                        </CFormLabel>
                        <CInputGroup>
                          <CFormInput
                            size="sm"
                            name="panNumber"
                            value={panNumbernew}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChangenewpan}
                          />
                          <CInputGroupText className="p-0">
                            <CTooltip content="Verify Pan Card" placement="top">
                              <CButton size="sm" color="success" className="px-2 rounded-pill" onClick={getPanData}>
                                <i className="fa fa-check"></i>
                              </CButton>
                            </CTooltip>
                          </CInputGroupText>
                        </CInputGroup>
                      </CCol>
                    )}

                    {/* OWNER, Aadhar, Bank */}
                    {isHire && panNumbernew && (
                      vendor ? (
                        <VendorAvaiable panData={panData} />
                      ) : (
                        <OthersVendorNotAvailable
                          onFocus={onFocus}
                          onBlur={onBlur}
                          handleChange={handleChangeOTS}
                          values={values}
                          errors={errors}
                        />
                      )
                    )}


                    {/* TripRoute */}
                    {/* {panNumbernew && (
                      <>
                        <CCol md={3}>
                          <CFormLabel>Trip Routes</CFormLabel>
                          <CFormSelect name="tripRoute" value={values.tripRoute} onChange={handleChange}>
                            <option value="">Select</option>
                            {tripRouteList.map(({ id, route_name }) => (
                              <option key={id} value={String(id)}>
                                {route_name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel>
                            Freight Rate <REQ />
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            type="number"
                            value={freightRate}
                            readOnly
                            placeholder={routeLoading ? 'Loading...' : ''}
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel>Trip Advance </CFormLabel>
                          <CFormSelect name="advanceRequest" value={values.advanceRequest} onChange={handleChange}>
                            <option value="">Select</option>
                            {advanceReqList.map(({ id, name }) => (
                              <option key={id} value={String(id)}>
                                {name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CCol>
                        {values.advanceRequest === '1' && (
                          <CCol md={3}>
                            <CFormLabel>
                              Advance Eligible {advancePercentage} % <REQ />
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="number"
                              value={advanceEligible}
                              readOnly
                            />
                          </CCol>
                        )}
                      </>
                    )} */}
                    {(isHire && vendor) ? (
                      <>
                        {/* <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="shedName">
                            Shed Name <REQ />
                            {errors.shedName && (
                              <span className="small text-danger">{errors.shedName}</span>
                            )}
                          </CFormLabel>
                          <NlmtShedListSearchSelect
                            size="sm"
                            className="mb-1"
                            name="shedName"
                            value={values.shedName}
                            onChange={onChange}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            search_type="shed_name"
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel>Shed Mobile Number</CFormLabel>
                          <CFormInput size="sm" value={shedMob} readOnly />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel>Shed WhatsApp Number</CFormLabel>
                          <CFormInput size="sm" value={shedWhats} readOnly />
                        </CCol> */}
                      </>
                    ) : null}

                  </>
                )}
                {/* {(isHire && values.driverMobile1 && values.tripRoute) ? (

                  <CCol md={3}>
                    <CFormLabel>
                      Freight Rate <REQ />
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      type="number"
                      value={freightRate}
                      readOnly
                      placeholder={routeLoading ? 'Loading...' : ''}
                    />
                  </CCol>
                ) : null} */}
                {(isHire) ? (
                  <>
                    <CCol md={3}>
                      <CFormLabel>Trip Routes</CFormLabel>
                      <CFormSelect name="tripRoute" value={values.tripRoute} onChange={handleChange}>
                        <option value="">Select</option>
                        {tripRouteList.map(({ id, route_name }) => (
                          <option key={id} value={String(id)}>
                            {route_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>
                        Freight Rate <REQ />
                      </CFormLabel>
                      <CFormInput
                        size="sm"
                        type="number"
                        value={freightRate}
                        readOnly
                        placeholder={routeLoading ? 'Loading...' : ''}
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Trip Advance </CFormLabel>
                      <CFormSelect name="advanceRequest" value={values.advanceRequest} onChange={handleChange}>
                        <option value="">Select</option>
                        {advanceReqList.map(({ id, name }) => (
                          <option key={id} value={String(id)}>
                            {name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    {values.advanceRequest === '1' && (
                      <CCol md={3}>
                        <CFormLabel>
                          Advance Eligible {advancePercentage} % <REQ />
                        </CFormLabel>
                        <CFormInput
                          size="sm"
                          type="number"
                          value={advanceEligible}
                          readOnly
                        />
                      </CCol>
                    )}
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="shedName">
                        Shed Name <REQ />
                        {errors.shedName && (
                          <span className="small text-danger">{errors.shedName}</span>
                        )}
                      </CFormLabel>
                      <NlmtShedListSearchSelect
                        size="sm"
                        className="mb-1"
                        name="shedName"
                        value={values.shedName}
                        onChange={onChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        search_type="shed_name"
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel>Shed Mobile Number</CFormLabel>
                      <CFormInput size="sm" value={shedMob} readOnly />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel>Shed WhatsApp Number</CFormLabel>
                      <CFormInput size="sm" value={shedWhats} readOnly />
                    </CCol>
                  </>
                ) : null}

                {values.vehicle_type && (
                  <>
                    <CCol md={3}>
                      <CFormLabel>Expected Delivery Date <REQ /></CFormLabel>
                      <CFormInput
                        type="date"
                        name="expected_delivery_date"
                        value={values.expected_delivery_date}
                        onChange={handleChange}
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Remarks</CFormLabel>
                      <CFormTextarea rows="1" name="remarks" value={values.remarks} onChange={handleChange} />
                    </CCol>
                  </>
                )}


              </CRow>

              {(isParty && values.driverMobile1) ? (
                <CRow className="mt-3">
                  {(isHire && values.driverMobile1 && values.tripRoute) ? (

                    <CCol >
                      <CFormLabel>Trip Route</CFormLabel>
                      <CFormSelect name="tripRoute" value={values.tripRoute} onChange={handleChange}>
                        <option value="">Select</option>
                        {tripRouteList.map(({ id, route_name }) => (
                          <option key={id} value={String(id)}>
                            {route_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  ) : null}




                </CRow>
              ) : null}
              <CRow className="mt-4">
                {values.vehicle_type && (
                  <>
                    <CCol md={9}>
                      <Link to="/NlmtTripsheetCreationHome">
                        <CButton size="md" color="warning">Previous</CButton>
                      </Link>
                    </CCol>

                    <CCol md={3} className="text-end">
                      <CButton size="md" color="success" onClick={handleCreateClick}>
                        Create
                      </CButton>
                      <CButton size="md" color="danger" className="ms-2" onClick={() => setRejectConfirm(true)}>
                        Reject
                      </CButton>
                    </CCol>
                  </>
                )}
              </CRow>
            </CForm>
          </CTabPane>
        </CTabContent>
      </CCard>

      {/* REJECT MODAL */}
      <CModal visible={rejectConfirm} backdrop="static">
        <CModalBody>Are you sure to reject this Tripsheet?</CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => createTripsheet(2)}>
            Confirm
          </CButton>
          <CButton color="secondary" onClick={() => setRejectConfirm(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ERROR MODAL */}
      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader>
          <CModalTitle>Error</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="danger">{errorMsg}</CAlert>
        </CModalBody>
      </CModal>
      <ToastContainer />
    </>
  )
}

export default NlmtTripsheetCreationOthers
