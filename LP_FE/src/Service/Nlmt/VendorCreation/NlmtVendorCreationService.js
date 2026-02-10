import AppConfig from "src/AppConfig";
import api from 'src/Service/Config'

const SINGLE_VEHICLE_DOCUMENT_INFO_URL = AppConfig.api.baseUrl + '/NlmtDocumentVerification/'

const VENDOR_DATA = AppConfig.api.baseUrl + '/nlmtVendor_data/'
const VENDOR = AppConfig.api.baseUrl + '/nlmtVendorcreation'
const VENDOR_REQUEST = AppConfig.api.baseUrl + '/nlmtVendorRequest'
const VENDOR_APPROVAL = AppConfig.api.baseUrl + '/nlmtVendorApproval/'
const VENDOR_CONFIRMATION = AppConfig.api.baseUrl + '/nlmtVendorConfirmation/'
const VENDOR_EXTENSION = AppConfig.api.baseUrl + '/sap_nlmt_vendor_extension_info/'
const VENDOR_UPDATION_REQUEST_URL = AppConfig.api.baseUrl + '/nlmtVendorInfoUpdation'
const VENDOR_EXTENSION_REQUEST_URL = AppConfig.api.baseUrl + '/nlmtVendorInfoExtension'

const TS_VENDOR_CHANGE_REQUEST_DATA = AppConfig.api.baseUrl + '/ts_nlmt_vendor_change_request_data/'
const TS_VENDOR_CHANGE_REQUEST_REPORT_DATA = AppConfig.api.baseUrl + '/ts_nlmt_vendor_change_request_report_data/'
const TS_VENDOR_CHANGE_AH_APPROVAL_REQUEST_DATA = AppConfig.api.baseUrl + '/ts_nlmt_vendor_change_ah_approval_request_data/'
const TS_VENDOR_CHANGE_OH_APPROVAL_REQUEST_DATA = AppConfig.api.baseUrl + '/ts_nlmt_vendor_change_oh_approval_request_data/'
const SINGLE_VEHICLE_DOCUMENT_INFO_BY_PID_URL = AppConfig.api.baseUrl + '/nlmtDocumentVerificationByPid'

const VENDOR_CHANGE_REQUEST_UPDATION_URL = AppConfig.api.baseUrl + '/nlmtVendorChangeRequestInfoUpdation'
const VENDOR_CHANGE_REQUEST_UPDATION_AHOH_URL = AppConfig.api.baseUrl + '/nlmtVendorChangeRequestAHOHApprovalInfoUpdation'

class NlmtVendorCreationService {
  // VENDOR CREATION REQUEST
  getVendorRequestTableData() {
    return api.get(VENDOR_REQUEST)
  }
  getVehicleDocumentInfo(vehicle_id) {
    return api.get(SINGLE_VEHICLE_DOCUMENT_INFO_URL + vehicle_id)
  }

  // VENDOR CREATION APPROVAL
  getVendorApprovalTableData() {
    return api.get(VENDOR_APPROVAL)
  }

  updateVendorRequestData(id, data) {
    return api.post(VENDOR + '/' + id, data)
  }

  // VENDOR CREATION CONFIRMATION
  getVendorConfirmationTableData() {
    return api.get(VENDOR_CONFIRMATION)
  }

  getVendorsByPan() {
    return api.get(VENDOR_DATA)
  }

  updateVendorConfirmationData(id, data) {
    // does not do anything useful

    return api.post(VENDOR + '/' + id, data)
  }

  updateVendorInfo(data){
    return api.post(VENDOR_UPDATION_REQUEST_URL, data)
  }

  // Fetch Vendor Extension Data
  getVendorExtensionTableData() {
    return api.get(VENDOR_EXTENSION)
  }

  extendVendorInfo(data){
    return api.post(VENDOR_EXTENSION_REQUEST_URL, data)
  }

  getTSVendorChangeRequestData() {
    return api.get(TS_VENDOR_CHANGE_REQUEST_DATA)
  }

  getTSVendorChangeAhApprovalRequestData() {
    return api.get(TS_VENDOR_CHANGE_AH_APPROVAL_REQUEST_DATA)
  }
  getTSVendorChangeOhApprovalRequestData() {
    return api.get(TS_VENDOR_CHANGE_OH_APPROVAL_REQUEST_DATA)
  }

  getVehicleDocumentInfoByPid(pID) {
    return api.get(SINGLE_VEHICLE_DOCUMENT_INFO_BY_PID_URL + '/' + pID)
  }

  updateVendorChangeRequestData(data){
    return api.post(VENDOR_CHANGE_REQUEST_UPDATION_URL, data)
  }

  updateVendorChangeRequestAOHData(data){
    return api.post(VENDOR_CHANGE_REQUEST_UPDATION_AHOH_URL, data)
  }

  getTSVendorChangeRequestReportData() {
    return api.get(TS_VENDOR_CHANGE_REQUEST_REPORT_DATA)
  }
}

export default new NlmtVendorCreationService()
