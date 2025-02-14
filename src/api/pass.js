import { request } from './request';

const API_FACE_URL = '/passHistory'
const API_PEDESTRIAN_URL = '/pedestrianHistory'
const API_VEHICHLE_URL = '/vehicleHistory'
const API_NONMOTOR_URL = '/nonmotorHistory'
const API_CHANNEL_URL = "/channel";

const passApi = {
  Get(param = {}) {
    return request({
      url: `${API_FACE_URL}?pageSize=${param.pageSize}&pageNum=${param.pageNum}&time=${param.time}&channelIDs=${param.channelIDs}&gender=${param.gender}&mask=${param.mask}&glass=${param.glass}&hat=${param.hat}&startTime=${param.startTime}&endTime=${param.endTime}`,
      param
    })
  },
  GetDet(id, param = {}) {
    return request({
      url:`${API_FACE_URL}/${id}`,
      param
    })
  },
  Post(data) {
    return request({
      url: API_FACE_URL,
      method: 'POST',
      data
    })
  },
  Put(data) {
    return request({
      url: API_FACE_URL,
      method: 'PUT',
      data
    })
  },
  Delete(data) {
    return request({
      url: API_FACE_URL,
      method: 'DELETE',
      data
    })
  },
}

const pedestrianApi = {
  Get(param = {}) {
    console.log(param);
    return request({
      url: `${API_PEDESTRIAN_URL}?pageSize=${param.pageSize}&pageNum=${param.pageNum}&time=${param.time}&channelIDs=${param.channelIDs}&gender=${param.gender}&age=${param.age}&upperColor=${param.upperColor}&lowerColor=${param.lowerColor}&startTime=${param.startTime}&endTime=${param.endTime}`,
      param
    })
  },
  GetDet(id, param = {}) {
    return request({
      url: `${API_PEDESTRIAN_URL}/${id}`,
      param
    })
  },
}

const vehicleApi = {
  Get(param = {}) {
    return request({
      url: `${API_VEHICHLE_URL}?pageSize=${param.pageSize}&pageNum=${param.pageNum}&time=${param.time}&channelIDs=${param.channelIDs}&vehicleID=${param.vehicleID}&type=${param.type}&make=${param.make}&model=${param.model}&carColor=${param.carColor}&plateColor=${param.plateColor}&marker=${param.marker}&pose=${param.pose}&startTime=${param.startTime}&endTime=${param.endTime}`,
      param
    })
  },
  GetDet(id, param = {}) {
    return request({
      url: `${API_VEHICHLE_URL}/${id}`,
      param
    })
  },
}

const nonmotorApi = {
  Get(param = {}) {
    return request({
      url: `${API_NONMOTOR_URL}?pageSize=${param.pageSize}&pageNum=${param.pageNum}&time=${param.time}&channelIDs=${param.channelIDs}&transportation=${param.transportation}&transportationColor=${param.transportationColor}&attitude=${param.attitude}&startTime=${param.startTime}&endTime=${param.endTime}`,
      param
    })
  },
  GetDet(id, param = {}) {
    return request({
      url: `${API_NONMOTOR_URL}/${id}`,
      param
    })
  },
}

const channelApi = {
  Get(param = {}) {
    return request({
      url: `${API_CHANNEL_URL}?pageSize=99`,
      param
    })
  },
}
export {
  passApi, pedestrianApi, vehicleApi, nonmotorApi, channelApi
}
