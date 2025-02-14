import { request } from './request';

const API_ALG_CONFIG = "/nvr/alg/config";
const API_ALG_URL = "/nvr/alg";
const API_ALG_RESET_URL = "/nvr/alg/reset";
const API_ALGVERSION_URL = "/nvr/algver";

const algApi = {
  Config(param) {
    return request({
      url: API_ALG_CONFIG, 
      param
    });
  },
  Get(search) {
    return request({
      url: `${API_ALG_URL}?search=${search}`
    });
  },
  GetEnableList(status) {
    return request({
      url: `${API_ALG_URL}?status=${status}`
    });
  },
  Reset() {
    return request({
      method: 'POST',
      url: API_ALG_RESET_URL
    })
  },
  Post(data) {
    return request({
      method: 'POST',
      url: API_ALG_URL, 
      data
    });
  },
  Put(id, data) {
    return request({
      method: 'PUT',
      url: `${API_ALG_URL}/${id}`, 
      data
    });
  },
  Delete(id, param) {
    return request({
      method: 'DELETE',
      url: `${API_ALG_URL}/${id}`, 
      param
    });
  },
  GetVersion(id) {
    return request({
      url: `${API_ALGVERSION_URL}/${id}`
    });
  },
  PostVersion(id, data) {
    return request({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: 'POST',
      url: `${API_ALGVERSION_URL}/${id}`, 
      data
    });
  },
  PutVersion(id, data) {
    return request({
      method: 'PUT',
      url: `${API_ALGVERSION_URL}/${id}`,
      data
    });
  },
  ChgVersion(algId, id) {
    return request({
      method: 'PUT',
      url: `${API_ALGVERSION_URL}/${algId}/${id}`
    });
  },
  getVerModels(id) {
    return request({
      url: `${API_ALGVERSION_URL}/models/${id}`
    });
  },
}
export { algApi }