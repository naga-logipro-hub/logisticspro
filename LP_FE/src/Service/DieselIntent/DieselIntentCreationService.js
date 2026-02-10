import AppConfig from 'src/AppConfig'
import api from '../Config'

const DIESEL_BASE_URL = AppConfig.api.baseUrl + '/Diesel/'
const DIESEL_CREATE_URL = AppConfig.api.baseUrl + '/Diesel'
const DIESEL_INDENT_REQUEST_CANCEL_URL = AppConfig.api.baseUrl + '/Diesel_indent_cancel'
const DIESEL_CONFIRM_URL = AppConfig.api.baseUrl + '/Diesel_confirm/'
const DIESEL_VENDOR_URL = AppConfig.api.baseUrl + '/dieselvendor/'
const DIESEL_APPROVAL_URL = AppConfig.api.baseUrl + '/Diesel_Approval/'
const DIESEL_REGISTER_VENDOR_URL = AppConfig.api.baseUrl + '/register_vendor_index/'
const DIESEL_CREATE_REGISTER_URL = AppConfig.api.baseUrl + '/Register_Vendor'
const DIESEL_VENDOR_CHANGE_URL = AppConfig.api.baseUrl + '/Register_Diesel_Vendor_Change'
const DIESEL_CREATE_REGISTER_LIST_URL = AppConfig.api.baseUrl + '/diesel_details_get_single_trip/'

class DieselIntentCreationService {
  getVehicleReadyToDiesel() {
    return api.get(DIESEL_BASE_URL)
  }
  getSingleVehicleInfoOnGate(parkingYardID) {
    return api.get(DIESEL_BASE_URL + parkingYardID)
  }
  getSingleVehicleInfoOnConfirm(parkingYardID) {
    return api.get(DIESEL_BASE_URL + parkingYardID)
  }
  createDiesel(data) {
    return api.post(DIESEL_CREATE_URL, data)
  }
  updateDiesel(id, values) {
    return api.post(DIESEL_BASE_URL + id, values)
  }
  getDieselVendor() {
    return api.get(DIESEL_VENDOR_URL)
  }
  getDieselInfoById(id) {
    return api.get(DIESEL_VENDOR_URL + id)
  }
  getVehicleReadyToDieselConfirm() {
    return api.get(DIESEL_CONFIRM_URL)
  }
  getVehicleReadyToDieselApproval() {
    return api.get(DIESEL_APPROVAL_URL)
  }
  getVehicleReadyToDieselRegisterVendor() {
    return api.get(DIESEL_REGISTER_VENDOR_URL)
  }
  createDieselRegisterVendor(data) {
    return api.post(DIESEL_CREATE_REGISTER_URL, data)
  }
  singleAdditionalDieselDetailsList(id) {
    return api.get(DIESEL_CREATE_REGISTER_LIST_URL+ id)
  }
  cancelDieselIndentRequest(value) {
    return api.post(DIESEL_INDENT_REQUEST_CANCEL_URL, value)
  }

  /* Diesel Vendor Change By Admin */
  adminUpdateDieselVendor(data) {
    return api.post(DIESEL_VENDOR_CHANGE_URL, data)
  }
}

export default new DieselIntentCreationService()
