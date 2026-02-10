import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import ChatBot from "../components/chatbot/ChatBot";
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/* ============ Set Footer Disble Condition Part Start ============ */
let sfd = location.href
let gh = sfd.lastIndexOf('/');
console.log(gh)
let vbn = sfd.substring(0,gh);
console.log(vbn);
let gh1 = vbn.lastIndexOf('/');
let vbn1 = vbn.substring(gh1+1);
let footer_disable = !(vbn1 == 'ShipmentCreationNLFDReport' || vbn1 == 'ShipmentCreationNLCDReport')
/* ============ Set Footer Disble Condition Part End ============ */

const DefaultLayout = () => {
  return (
    <div>
      <ToastContainer />
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
          <ChatBot />
        </div>

        {footer_disable && <AppFooter /> }

      </div>
    </div>
  )
}

export default DefaultLayout
