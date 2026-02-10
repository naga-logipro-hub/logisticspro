import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody,
  CCardHeader
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import './InternalComponents/LoginWithDiwali.css'
import nagaLogo from 'src/assets/logo/Naga-logo.png'
import wheatLogo from 'src/assets/logo/wheat.png'

const LoginFormComponent = ({ handleLogin, state, setState, setForgetPassword }) => {
  const [particles, setParticles] = useState([])
  const [bursting, setBursting] = useState(false)

  const colors = ['#FFD700', '#FF6347', '#32CD32', '#FF1493', '#00BFFF', '#FFA500']

  const createCrackerBurst = (centerX, centerY) => {
    setBursting(true)
    const newParticles = []
    const numParticles = Math.floor(Math.random() * 20) + 30 // 30-50 particles per burst

    for (let i = 0; i < numParticles; i++) {
      const angle = (Math.PI * 2 / numParticles) * i + (Math.random() - 0.5) * 0.5
      const speed = Math.random() * 200 + 100 // 100-300 px/sec
      const size = Math.random() * 8 + 3 // 3-11px
      const color = colors[Math.floor(Math.random() * colors.length)]

      newParticles.push({
        id: Date.now() + Math.random(),
        x: centerX,
        y: centerY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        size,
        color,
        life: 3, // seconds
      })
    }

    setParticles(prev => [...prev, ...newParticles])

    // Clear bursting after 3 seconds to allow next burst
    setTimeout(() => setBursting(false), 3000)
  }

  useEffect(() => {
    const particleInterval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: p.x + p.dx * 0.016, // assuming 60fps, 16ms per frame
          y: p.y + p.dy * 0.016,
          dy: p.dy + 100 * 0.016, // gravity
          life: p.life - 0.016
        })).filter(p => p.life > 0)
      )
    }, 16)

    return () => clearInterval(particleInterval)
  }, [])

  const handleBurst = () => {
    if (!bursting) {
      const container = document.querySelector('.diwali-login-wrapper')
      if (container) {
        const centerX = container.offsetWidth / 2
        const centerY = container.offsetHeight / 2
        createCrackerBurst(centerX, centerY)
      }
    }
  }

  return (
    <div className="diwali-login-wrapper">
      <div className="fireworks-overlay animate-fireworks" />
      {particles.map(particle => (
        <div
          key={particle.id}
          className="cracker-particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life / 3, // fade over 3 seconds
          }}
        />
      ))}
      <CCard
        className="login-card shadow-lg diwali-glowing-card"
        style={{backgroundColor:"beige"}}
        onMouseEnter={handleBurst}
      >
        {/* style={{backgroundColor:"beige", backgroundImage:`url(${wheatLogo})`}}> */}
        <CCardHeader className="login-header text-dark text-center"  style={{backgroundColor:"beige"}}>
          <div className="d-flex flex-column align-items-center">
            <CImage
              rounded
              thumbnail
              src={nagaLogo} 
              width={100}
              height={100}
            />
            <h1 className="mt-2" style={{color:"#4d3227", fontFamily:"arial", fontWeight:"bold"}} >LOGISTICS PRO</h1>
            <p className="fw-bold mb-1"><h4 style={{color:"indigo", fontFamily:"arial", fontWeight:"bold"}}>ADMIN & USER LOGIN</h4></p>
            {/* <p className="diwali-wish" style={{color:"green", fontFamily:"arial", fontWeight:"bold"}}><b>🪔 Happy Diwali! May your journeys be bright & safe ✨</b></p> */}
          </div>
        </CCardHeader>

        <CCardBody>
          <CForm onSubmit={handleLogin}>
            {state.error && <div className="text-danger mb-3">{state.error}</div>}

            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilUser} />
              </CInputGroupText>
              <CFormInput
                placeholder="Username / Employee Code"
                value={state.empid}
                required
                onChange={(e) => setState({ ...state, empid: e.target.value })}
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Password"
                value={state.password}
                required
                onChange={(e) => setState({ ...state, password: e.target.value })}
              />
            </CInputGroup>

            <div className="d-flex justify-content-center mt-4">
            {/* <div className="d-flex justify-content-between mt-4"> */}
              <CButton type="submit" color="success" className="px-4" onMouseEnter={handleBurst}>
                <b style={{color:"white"}}>Login</b>
              </CButton>
              <CButton
                type="button"
                onClick={() => setForgetPassword(true)}
                color="secondary"
                className="px-4 text-dark"
                style={{marginLeft:"5%", color:"red"}}
              >
                <b style={{color:"indigo"}}>Forgot Password</b>
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default LoginFormComponent
