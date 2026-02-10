/* eslint-disable prettier/prettier */
import {
  CAlert,
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import NlmtRouteMasterService from 'src/Service/Nlmt/Masters/NlmtRouteMasterService'

const NlmtRouteMasterEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  /* ================= USER INFO ================= */
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  const user_id = user_info.user_id

  /* ================= STATES ================= */
  const [routeName, setRouteName] = useState('')
  const [freightRate, setFreightRate] = useState('')
  const [originalData, setOriginalData] = useState({})
  const [loading, setLoading] = useState(true)

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState('')

  const REQ = () => <span className="text-danger"> *</span>

  /* ================= HANDLERS ================= */
  const handleRouteChange = (e) => {
    setRouteName(e.target.value.toUpperCase())
  }

  const handleFreightChange = (e) => {
    setFreightRate(e.target.value)
  }

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    NlmtRouteMasterService.getNlmtRouteById(id)
      .then((res) => {
        const data = res.data.data
        setRouteName(data.route_name)
        setFreightRate(String(data.freight_rate))
        setOriginalData(data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load route data')
        setLoading(false)
      })
  }, [id])

  /* ================= UPDATE ================= */
  const updateRoute = (e) => {
    e.preventDefault()

    /* ---------- Validations ---------- */
    if (!routeName.trim()) {
      toast.warning('Route Required')
      return
    }

    if (!/^[A-Z ]+$/.test(routeName)) {
      toast.warning('Route Name should contain only letters and spaces')
      return
    }

    if (!freightRate.trim()) {
      toast.warning('Freight Rate Required')
      return
    }

    if (!/^\d+(\.\d+)?$/.test(freightRate)) {
      toast.warning('Freight Rate should be a valid number')
      return
    }

    if (Number(freightRate) <= 0) {
      toast.warning('Freight Rate must be greater than 0')
      return
    }

    /* ---------- No Change Detection ---------- */
    if (
      routeName === originalData.route_name &&
      freightRate === String(originalData.freight_rate)
    ) {
      toast.info('No changes detected')
      return
    }

    /* ---------- API Call ---------- */
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('route_name', routeName)
    formData.append('freight_rate', freightRate)
    formData.append('updated_by', user_id)

    setLoading(true)

    NlmtRouteMasterService.updateNlmtRoutes(id, formData)
      .then((res) => {
        setLoading(false)

        if (res.status === 200) {
          toast.success('NLMT Route Updated Successfully!')
          setTimeout(() => {
            navigate('/NlmtRouteMasterTable')
          }, 800)
        }

        if (res.status === 202) {
          toast.warning('Route Already Exists!')
        }
      })
      .catch((err) => {
        setLoading(false)

        if (err.response?.data?.errors) {
          let output = ''
          const object = err.response.data.errors
          for (const key in object) {
            output += `• ${object[key]}\n`
          }
          setError(output)
          setErrorModal(true)
        } else {
          toast.error('Something went wrong!')
        }
      })
  }

  /* ================= JSX ================= */
  return (
    <>
      {loading && <Loader />}

      {!loading && (
        <CCard>
          <CTabContent>
            <CTabPane visible>
              <CForm className="row g-3 m-2 p-1" onSubmit={updateRoute}>
                <CRow>
                  <CCol md={3}>
                    <CFormLabel>
                      Route Name <REQ />
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      maxLength={30}
                      value={routeName}
                      onChange={handleRouteChange}
                    />
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel>
                      Freight Rate <REQ />
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={freightRate}
                      onChange={handleFreightChange}
                    />
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <CButton
                      type="submit"
                      color="warning"
                      className="mx-1 px-3 text-white"
                    >
                      UPDATE
                    </CButton>

                    <Link to="/NlmtRouteMasterTable">
                      <CButton
                        type="button"
                        color="warning"
                        className="mx-1 px-3 text-white"
                      >
                        BACK
                      </CButton>
                    </Link>
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>
          </CTabContent>

          {/* ERROR MODAL */}
          <CModal visible={errorModal} backdrop="static">
            <CModalHeader>
              <CModalTitle>Error</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CAlert color="danger" style={{ whiteSpace: 'pre-line' }}>
                {error}
              </CAlert>
            </CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={() => setErrorModal(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </CCard>
      )}
    </>
  )
}

export default NlmtRouteMasterEdit
