import AppConfig from 'src/AppConfig'
import api from '../Config'

const DIESEL_VENDOR_MASTER_BASE_URL = AppConfig.api.baseUrl + '/dieselvendor'
const DIESEL_VENDOR_MASTER_VENDOR_CODE_URL = AppConfig.api.baseUrl + '/dieselvendorbycode'

class DieselVendorMasterService {
  getDieselVendors() {
    return api.get(DIESEL_VENDOR_MASTER_BASE_URL)
  }

  createDieselVendors(value) {
    return api.post(DIESEL_VENDOR_MASTER_BASE_URL, value)
  }

  getDieselVendorsById(DieselVendorsId) {
    return api.get(DIESEL_VENDOR_MASTER_BASE_URL + '/' + DieselVendorsId)
  }

  updateDieselVendors(DieselVendorsId, DieselVendors) {
    return api.post(DIESEL_VENDOR_MASTER_BASE_URL + '/' + DieselVendorsId, DieselVendors)
  }

  deleteDieselVendors(DieselVendorsId) {
    return api.delete(DIESEL_VENDOR_MASTER_BASE_URL + '/' + DieselVendorsId)
  }
  getDieselVendorsByCode(DieselVendorsCode) {
    return api.get(DIESEL_VENDOR_MASTER_VENDOR_CODE_URL + '/' + DieselVendorsCode)
  }
}

export default new DieselVendorMasterService()
