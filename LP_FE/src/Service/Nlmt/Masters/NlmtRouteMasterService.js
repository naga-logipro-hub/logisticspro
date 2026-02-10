import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const NLMT_ROUTE_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/Route'


class NlmtRouteMasterService {

  getNlmtRoutes() {
    return api.get(NLMT_ROUTE_MASTER_BASE_URL)
  }

  createNlmtRoute(value) {
    return api.post(NLMT_ROUTE_MASTER_BASE_URL, value)
  }

  getNlmtRouteById(id) {
    return api.get(NLMT_ROUTE_MASTER_BASE_URL + '/' + id)
  }


  updateNlmtRoutes(id, Routes) {
    return api.post(NLMT_ROUTE_MASTER_BASE_URL + '/' + id, Routes)
  }

  deleteNlmtRoute(id) {
    return api.delete(NLMT_ROUTE_MASTER_BASE_URL + '/' + id)
  }
}

export default new NlmtRouteMasterService()
