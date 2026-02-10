import AppConfig from 'src/AppConfig'
import api from '../Config'

const GLLIST_MASTER_BASE_URL = AppConfig.api.baseUrl + '/GL_List'

class GLListMasterService {
  getGLlist() {
    return api.get(GLLIST_MASTER_BASE_URL)
  }
  createGLlist(value) {
    return api.post(GLLIST_MASTER_BASE_URL, value)
  }

  getGLlistId(GLlistId) {
    return api.get(GLLIST_MASTER_BASE_URL + '/' + GLlistId)
  }

  updateGLlist(GLlistId,data) {
    return api.post(GLLIST_MASTER_BASE_URL + '/' + GLlistId,data)
  }

  deleteGLlist(GLlistIds) {
    return api.delete(GLLIST_MASTER_BASE_URL + '/' + GLlistIds)
  }

}

export default new GLListMasterService()
