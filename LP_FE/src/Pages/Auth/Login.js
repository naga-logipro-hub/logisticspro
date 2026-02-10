import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCardImage,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
// import logo from 'src/assets/logo/geminimasterlogo.png'
// import logo from 'src/assets/logo/updatedNaga.png'
import logo from 'src/assets/logo/naga_new.png'
// import logo from 'src/assets/logo/masterlogo.png'
import Swal from "sweetalert2";
import Loader from 'src/components/Loader'
import AuthService from 'src/Service/Auth/AuthService'
import authConstant from 'src/redux/Auth/AuthConstant'
import loginRequest from 'src/redux/Auth/AuthAction'
import LocalStorageService from 'src/Service/LocalStoage'
import LoginFormComponent from './AuthComponents/LoginFormComponent'
import ForgetPasswordFromComponent from './AuthComponents/ForgetPasswordFromComponent'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './AuthComponents/InternalComponents/LoginWithDiwali.css'
import { Navigation } from '@coreui/coreui'

import logoC1 from 'src/assets/logo/climate/A_Naga_6_10_AM.png'
import logoC2 from 'src/assets/logo/climate/B_Naga_10AM_2PM.png'
import logoC3 from 'src/assets/logo/climate/C_Naga_2_5PM.png'
import logoC31 from 'src/assets/logo/climate/test1.gif'
import logoC4 from 'src/assets/logo/climate/D_Naga_5_7PM.png'
import logoC5 from 'src/assets/logo/climate/E_Naga_7PM_3AM.png'
import logoC6 from 'src/assets/logo/climate/F_Naga_3_6AM.png'
import logoC7 from 'src/assets/logo/climate/G_Naga.png'

const Login = () => {
  const [state, setState] = useState({
    empid: '',
    username: '',
    password: '',
    email: '',
    mobile_no: '',
    otp: '',
    loading: false,
    otpPage: false,
    confirmOtp: false,
    newPassword: '',
    newPasswordConfirm: '',
    error: '',
  })

  const [fetch, setFetch] = useState(false)
  const [forgetPassword, setForgetPassword] = useState(false)
  const navigation = useNavigate()

  useEffect(()=>{
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json) 
    if(user_info){
      //
    } else {
      setFetch(true)
    } 
    
  },[])

  //this function handles the login request
  const handleLogin = (e) => {
    e.preventDefault()
    setFetch(false)
    AuthService.login(state)
      .then((res) => {
        // setFetch(true)
        console.log(res,'handleLogin-res')
        console.log(state,'handleLogin-state')
        if (res.status == 200) {
          LocalStorageService.setLocalstorage('auth_token', res.data.token)
          LocalStorageService.setLocalstorage('user_info', JSON.stringify(res.data.data))
          LocalStorageService.setLocalstorage(
            'page_permission',
            JSON.stringify(res.data.data.page_permissions)
          )
          navigation('/Dashboard')
          window.location.reload(true)
        } else if (res.status == 201) {
          setFetch(true)
          toast.error('User Id was Blocked. Kindly Contact Admin to Unblock..')
        }
      })
      .catch((error) => {
        setFetch(true)
        console.log(error)
        if (error.response.status === 401) {
          setState({ ...state, error: error.response.data.message })
        } else if(error.code == 'ERR_NETWORK'){
          Swal.fire({
            title: 'Backend Server cannot be started. Kindly contact admin..!',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })
        }

      })
  }

  //this function handles the Forget password request & send OTP
  const handleForgetPassword = (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })

    let data = new FormData()
    data.append('empid', state.empid)
    AuthService.forgetPassword(data)
      .then((res) => {
        if (res.status == 200) {
          setState({ ...state, loading: false, otpPage: true, error: '' })
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setState({ ...state, error: error.response.data.message })
        }
      })
  }

  //this function handles the verify OTP request & Verify OTP MATCHS
  const verifyOtp = (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })

    let data = new FormData()
    data.append('empid', state.empid)
    data.append('otp', state.otp)
    AuthService.verifyOtp(data)
      .then((res) => {
        if (res.status === 200) {
          setState({ ...state, loading: false, confirmOtp: true, error: '' })
        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          setState({ ...state, error: error.response.data.message })
        }
        if (error.response.status === 403) {
          setState({ ...state, error: error.response.data.message })
        }
      })
  }

  //this function handle the password change request to server and Update the new password
  const ChangePassword = (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })

    let data = new FormData()
   // data.append('email', state.email)
   data.append('empid', state.empid)
    data.append('password', state.newPassword)
    data.append('confirm_password', state.newPasswordConfirm)

    AuthService.changePassword(data)
      .then((res) => {
        if (res.status === 200) {
          setState({ ...state, loading: false, error: '' })
          toast.info('Password Changed Successfully!')
          // navigation('/')
          setTimeout(() => {
            window.location.reload(false)
          }, 1000)

        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setState({ ...state, error: error.response.data.message })
        }
      })
  }

  function getImageForCurrentTime() {
    const now = new Date();
    const hours = now.getHours();

    // Example time ranges
    if (hours >= 6 && hours < 10) {
      return logoC1   // 6 AM – 10 AM
    } 
    else if (hours >= 10 && hours < 14) {
      return logoC2         // 10 AM – 2 PM
    } 
    else if (hours >= 14 && hours < 17) {
      return logoC3           // 2 PM – 5 PM
      // return logoC31           // 2 PM – 5 PM
    } 
    else if (hours >= 17 && hours < 19) {
      return logoC4         // 5 PM – 7 PM
    } 
    else if ((hours >= 19 && hours < 24) || (hours >= 0 && hours < 3)) {
      return logoC5           // 7 PM – 3 AM
    }
    else if (hours >= 3 && hours < 6) {
      return logoC6          // 3 AM – 6 AM
    }
    else {
      return logoC7         // Other times
    }
  }

  return (
    <>
      {!fetch && <Loader />}{' '}
      {fetch && (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center" style={{ position: 'relative' }}>
          {/* <div className="snow"></div> */}
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={15}>
                <CCardGroup> 
                  <CCard
                    className="p-4" 
                    style={{
                      background: 'linear-gradient(135deg, #dae5efff, #d1d3f2ff)',
                      color: 'white'
                    }}
                  >
                    {/* <div className="snow"></div> */}
                    <CCardBody className="mt-2">
                      <img
                        // src={logo}
                        src={getImageForCurrentTime()}
                        alt=""
                        style={{aspectRatio:"3/2",width:"100%",objectFit:"cover"}}
                        // width={"780"}
                        // height={"520"}
                      />
                    </CCardBody>
                  </CCard>
                  <CCard
                    className="p-1"
                    style={{
                      background: 'linear-gradient(135deg, #dae5efff, #d1d3f2ff)',
                      color: 'white'
                    }}
                  >
                    <CCardBody className="mt-1">
                      {forgetPassword ? (
                        <ForgetPasswordFromComponent
                          handleLogin={handleLogin}
                          setState={setState}
                          state={state}
                          handleForgetPassword={handleForgetPassword}
                          setForgetPassword={setForgetPassword}
                          forgetPassword={forgetPassword}
                          verifyOtp={verifyOtp}
                          ChangePassword={ChangePassword}
                        />
                      ) : (
                        <LoginFormComponent
                          handleLogin={handleLogin}
                          setState={setState}
                          state={state}
                          setForgetPassword={setForgetPassword}
                        />
                      )}
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      )}
    </>
  )
}

export default Login
