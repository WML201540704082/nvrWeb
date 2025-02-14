import { request } from './request';

const API_Lib_FACEREPO_URL = '/faceRepo'
const API_Lib_VEHICLEREPO_URL = '/vehicleRepo'
const API_Lib_FACE_URL = '/face'
const API_Lib_FACES_URL = '/faces'
const API_Lib_VEHICLE_URL = '/vehicle'
const API_Lib_VIDEO_URL = '/system/videoProcess'

const faceRepoApi = {
  Get(param = {}) {
    return request({
      url: `${API_Lib_FACEREPO_URL}?pageSize=99`,
      param
    })
  },
  Post(data) {
    return request({
      url: API_Lib_FACEREPO_URL,
      method: 'POST',
      data
    })
  },
  Put(id, data) {
    return request({
      url: `${API_Lib_FACEREPO_URL}/${id}`,
      method: 'PUT',
      data
    })
  },
  Delete(id) {
    return request({
      url: `${API_Lib_FACEREPO_URL}/${id}`,
      method: 'DELETE'
    })
  },
}

const vehicleRepoApi = {
  Get(param={}) {
    return request({
      url: `${API_Lib_VEHICLEREPO_URL}?pageSize=99`, 
      param
    })
  },
  Post(data) {
    return request({
      url: API_Lib_VEHICLEREPO_URL, 
      method: 'POST',
      data
    })
  },
  Put(id, data) {
    return request({
      url: `${API_Lib_VEHICLEREPO_URL}/${id}`, 
      method: 'PUT',
      data
    })
  },
  Delete(id) {
    return request({
      url: `${API_Lib_VEHICLEREPO_URL}/${id}`,
      method: 'DELETE'
    })
  }
}

const faceApi = {
  Get(param) {
    return request({
      url: `${API_Lib_FACE_URL}?pageNum=${param.pageNum}&pageSize=${param.pageSize}&repoID=${param.repoID}&search=${param.search}`
    })
  },
  Post(data) {
    return request({
      url: API_Lib_FACE_URL, 
      method: 'POST',
      data
    })
  },
  Put(id, data) {
    return request({
      url: `${API_Lib_FACE_URL}/${id}`, 
      method: 'PUT',
      data
    })
  },
  Delete(id) {
    return request({
      url: `${API_Lib_FACE_URL}/${id}`,
      method: 'DELETE'
    })
  },
  BatchPost(data) {
    return request({
      url: API_Lib_FACES_URL, 
      method: 'POST',
      data
    })
  },
  BatchDelete(ids) {
    return request({
      url: API_Lib_FACE_URL, 
      method: 'DELETE',
      data: ids
    })
  },
  VideoDelete() {
    return request({
      url: API_Lib_VIDEO_URL,
      method: 'DELETE'
    })
  },
  VideoPost (data) {
    return request({
      url: API_Lib_VIDEO_URL, 
      method: 'POST',
      data
    })
  }
}

const vehicleApi = {
  Get(param) {
    return request({
      url: `${API_Lib_VEHICLE_URL}?pageNum=${param.pageNum}&pageSize=${param.pageSize}&repoID=${param.repoID}&search=${param.search}`
    })
  },
  Post(data) {
    return request({
      url: API_Lib_VEHICLE_URL, 
      method: 'POST',
      data
    })
  },
  Put(id, data) {
    return request({
      url: `${API_Lib_VEHICLE_URL}/${id}`,
      method: 'PUT',
      data
    })
  },
  Delete(id) {
    return request({
      url: `${API_Lib_VEHICLE_URL}/${id}`,
      method: 'DELETE'
    })
  },
  BatchDelete(ids) {
    return request({
      url: API_Lib_VEHICLE_URL, 
      method: 'DELETE',
      data: ids
    })
  }
}

export {
  faceRepoApi,
  vehicleRepoApi,
  faceApi,
  vehicleApi
}
