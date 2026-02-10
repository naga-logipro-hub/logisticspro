/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NlmtRouteMasterService from 'src/Service/Nlmt/Masters/NlmtRouteMasterService'

const NlmtRouteMaster = () => {
  /* ==================== User Info ==================== */
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  const user_id = user_info.user_id
  const navigation = useNavigate()

  /* ==================== States ==================== */
  const [routeName, setRouteName] = useState('')
  const [freightRate, setFreightRate] = useState('')
  const [loading, setLoading] = useState(false)

  const [existingRoutes, setExistingRoutes] = useState([]) // 🔥 NEW

  const REQ = () => <span className="text-danger"> * </span>

  /* ==================== Load existing routes ==================== */
  useEffect(() => {
    NlmtRouteMasterService.getNlmtRoutes().then((res) => {
      setExistingRoutes(res.data.data || [])
    })
  }, [])

  /* ==================== Handlers ==================== */
  const handleRouteChange = (e) => {
    setRouteName(e.target.value.toUpperCase())
  }

  const handleFreightChange = (e) => {
    setFreightRate(e.target.value)
  }

  /* ==================== Submit ==================== */
  const addNewRoute = (e) => {
    e.preventDefault()

    if (!routeName.trim()) {
      toast.warning('Route Required')
      return
    }

    // 🔥 DUPLICATE ROUTE CHECK
    const isDuplicate = existingRoutes.some(
      (r) => r.route_name?.toUpperCase() === routeName.trim()
    )

    if (isDuplicate) {
      toast.warning('Route Already Exists!')
      return
    }

    if (!freightRate.trim()) {
      toast.warning('Freight Rate Required')
      return
    }

    if (!/^[A-Z ]+$/.test(routeName)) {
      toast.warning('Route Name should contain only letters and spaces')
      return
    }

    if (Number(freightRate) <= 0) {
      toast.warning('Freight Rate must be greater than 0')
      return
    }

    if (!/^\d+(\.\d+)?$/.test(freightRate)) {
      toast.warning('Freight Rate should be a valid number')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('route_name', routeName)
    formData.append('freight_rate', freightRate)
    formData.append('created_by', user_id)

    NlmtRouteMasterService.createNlmtRoute(formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success('Route Created Successfully!')
          navigation('/NlmtRouteMasterTable')
        } else if (res.status === 202) {
          toast.warning('Route Already Exists!')
        }
      })
      .catch(() => {
        toast.error('Something went wrong!')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /* ==================== JSX ==================== */
  return (
    <>
      {loading && <Loader />}

      <CCard>
        <CTabContent>
          <CTabPane visible>
            <CForm className="row g-3 m-2 p-1" onSubmit={addNewRoute}>
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
                <CCol xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CButton
                    type="submit"
                    color="success"
                    className="mx-1 px-3 text-white"
                    disabled={loading}
                  >
                    Submit
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
      </CCard>
    </>
  )
}

export default NlmtRouteMaster
