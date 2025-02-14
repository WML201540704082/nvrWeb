import { request } from './request';
import { source } from '@/api/request.js';

export async function login(data) {
    return request({
        url: '/login',
        method: 'POST',
        data,
    })
}

export async function getMachineApi(param={}) {
    return request({
        url: '/user/password/reset',
        param,
    })
}

export async function postMachineApi(data) {
    return request({
        url: '/user/password/reset',
        method: 'POST',
        data,
    })
}

// 查询用户权限
export async function userPermision() {
    return request({
        url: 'nvr/permision',
    })
}

// 退出登录
export async function logout() {
    return request({
        url: '/nvr/logout',
        method: 'DELETE',
    })
}

export async function nvrLogin(data) {
    return request({
        url: '/nvr/login',
        method: 'POST',
        data,
    })
}

// 预览通道
export async function getChannelList(params) {
    return request({
        url: '/nvr/preview/channel',
        params,
    })
}

// 预览通道
export async function getRecordChannelList(params) {
    return request({
        url: '/nvr/record/channel',
        params,
    })
}

// 预览通道分辨率切换
export async function getPreviewConfig(data) {
    return request({
        url: '/nvr/preview/channel/config',
        method: 'POST',
        data,
        cancelToken: source.token
    })
}

// 控制音频数据输出
export async function setAudioCtrl(id,data) {
    return request({
        url: `/nvr/play/channel/${id}/ctrl`,
        method: 'POST',
        data,
    })
}

// 手动录像开始
export async function manualStart(data) {
    return request({
        url: '/nvr/record/manual/start',
        method: 'POST',
        data,
    })
}

// 手动录像停止
export async function manualEnd(data) {
    return request({
        url: '/nvr/record/manual/stop',
        method: 'POST',
        data,
    })
}

export async function addChannel(data) {
    return request({
        url: '/nvr/channel',
        method: 'POST',
        data,
    })
}

// 查询回放日历
export async function playbackCalendar(data) {
    return request({
        url: '/nvr/record/querycalendar',
        method: 'POST',
        data,
    })
}

// 获取sessionId
export async function getSessionId(data) {
    return request({
        url: '/nvr/record/channel/config',
        method: 'POST',
        data,
    })
}

// 播放控制
export async function ctrlRecordVideo(id,data) {
    return request({
        url: `/nvr/record/channel/${id}/ctrl`,
        method: 'POST',
        data,
    })
}

// 用户列表
export async function userList() {
    return request({
        url: '/nvr/auth/user',
    })
}
// 用户组列表
export async function userGroupList() {
    return request({
        url: '/nvr/auth/role',
    })
}

// 用户组详情
export async function userGroupDetails(id) {
    return request({
        url: `nvr/auth/role/${id}`,
    })
}

// 查询用户详情
export async function userDetails(id) {
    return request({
        url: `nvr/auth/user/${id}`,
    })
}

// 新增用户
export async function addUser(data) {
    return request({
        url: 'nvr/auth/user',
        method: 'POST',
        data,
    })
}

// 编辑用户
export async function editUser(id,data) {
    return request({
        url: `nvr/auth/user/${id}`,
        method: 'PUT',
        data,
    })
}
// 删除用户
export async function deleteUser(id) {
    return request({
        url: `nvr/auth/user/${id}`,
        method: 'DELETE',
    })
}

// 重置密码
export async function resetPassword(data) {
    return request({
        url: `nvr/auth/user/${data.id}/password/reset`,
        method: 'PUT',
        data,
    })
}

// 修改密码
export async function editPassword(data) {
    return request({
        url: `nvr/auth/user/password`,
        method: 'PUT',
        data,
    })
}
const API_NET_URL = "/system/network";
const API_NET_Card_URL = "/system/netcardCount";
const API_DATETIME_URL = "/system/datetime";
const API_PLATFORM_URL = "system/config/eventupload"
const API_PLATFORM_IOT_URL = "system/config/iotserver"
const API_PLATFORM_EVENTSERVER_URL = "system/config/eventserver"
// 网络设置
export const netApi = {
    Get(params) {
        return request({
            url: API_NET_URL,
            params,
        })
    },
    GetDev(id) {
        return request({
            url: `${API_NET_URL}/${id}`,
        })
    },
    Put(data) {
        return request({
            url: API_NET_URL,
            method: 'PUT',
            data
        })
    },
};
export const netcardApi = {
    Get(params = {}) {
      return request({
        url: API_NET_Card_URL,
        params,
    })
    },
};

// 时间设置
export const datetimeApi = {
    Get(params = {}) {
        return request({
            url: API_DATETIME_URL,
            params
        })
    },
    Put(data) {
        return request({
            url: API_DATETIME_URL,
            method: 'PUT',
            data
        })
    },
};

// 获取IPC较时
export async function getIpc() {
    return request({
        url: '/nvr/system/time',
    })
}

// 更改IPC较时
export async function putIpc(data) {
    return request({
        url: '/nvr/system/time',
        method: 'PUT',
        data,
    })
}

// 网络高级设置
export const platformApi = {
    Get(params = {}) {
        return request({
            url: API_PLATFORM_URL,
            params
        })
    },
    Put(data) {
        return request({
            url: API_PLATFORM_URL,
            method: 'PUT',
            data
        })
    },
};

// 网络IOT设置
export const platformIOTApi = {
    Get(params = {}) {
        return request({
            url: API_PLATFORM_IOT_URL,
            params
        })
    },
    Put(data) {
        return request({
            url: API_PLATFORM_IOT_URL,
            method: 'PUT',
            data
        })
    },
};

// 金砖设置
export const platformEventServerApi = {
    Get(params = {}) {
        return request({
            url: API_PLATFORM_EVENTSERVER_URL,
            params
        })
    },
    Put(data) {
        return request({
            url: API_PLATFORM_EVENTSERVER_URL,
            method: 'PUT',
            data
        })
    },
};

// 用户状态列表
export async function getOnlineUser() {
    return request({
        url: '/nvr/auth/onlineUser',
    })
}

// 删除用户
export async function deleteOnlineUser(id,ip) {
    return request({
        url: `/nvr/auth/onlineUser/${id}/${ip}`,
        method: 'DELETE',
    })
}

// 获取遮盖区域
export async function getMaskArea(id) {
    return request({
        url: `/nvr/preview/channel/${id}/mask`,
        cancelToken: source.token
    })
}

// 获取回放--遮盖区域
export async function getRecordMaskArea(id) {
    return request({
        url: `/nvr/record/channel/${id}/mask`,
    })
}

//文件下载列表
export async function postFilelist(data) {
    return request({
        url: `/nvr/record/filelist`,
        method: 'POST',
        data
    })
}

//文件下载信息
export async function getFileInfo(data) {
    return request({
        url: `/nvr/record/file`,
        method: 'POST',
        data
    })
}

//关闭文件下载检索
export async function deleteFile(id,sessionID) {
    return request({
        url: `/nvr/record/filelist/${id}/${sessionID}`,
        method: 'DELETE'
    })
}

const API_CHANNEL_URL = "/channel";
export const channelApi = {
    Get(param = {}) {
        return request({
            url: `${API_CHANNEL_URL}?pageSize=99`,
            param
        })
    },
}

// 获取npu信息
export async function getNpuInfo() {
    return request({
        url: '/nvr/info/npu'
    })
}

// 事件播报信息
export async function eventBroadcast(data) {
    return request({
        url:`/nvr/info/event/query?pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
        method: 'POST',
        data: {...data},
    })
}

// 事件播报标记
export async function eventMark(id) {
    return request({
        url: `/nvr/info/event/mark/${id}`,
        method: 'PUT',
    })
}
// 日志列表查询
export async function getLogList(params) {
    return request({
        url: '/nvr/maintenance/weblog/query',
        params
    })
}
/**
 * 导出日志
 * @param {*} params 
 * @returns 
 */
export async function downloadLog(params) {
    return request({
        url: '/nvr/maintenance/weblog/download',
        responseType: 'blob',
        params
    })
}

// 视频状态 and 查询通道录像信息
export async function getVideoStatus(params) {
    return request({
        url: '/nvr/record/list',
        params,
    })
}

// 回放锁定配置
export async function lockConfig(data) {
    return request({
        url: `/nvr/record/lock/${data.channel}`,
        method: 'POST',
        data
    })
}

// 锁定列表
export async function lockList(params) {
    return request({
        url: '/nvr/record/lock/list',
        params
    })
}

// 解锁
export async function unLock(lockId) {
    return request({
        url: `/nvr/record/unlock/${lockId}`,
        method: 'POST'
    })
}

// 截图
export async function screenshot(channelId,type="0",mode=0) {
    return request({
        url: `/nvr/channel/${channelId}/instantFrame?type=${type}&mode=${mode}`,
    })
}

// 标签回放配置
export async function tagConfig( data ) {
    return request({
        url: `/nvr/record/label`,
        method: 'POST',
        data
    })
}

// 标签列表
export async function tagList( data ) {
    return request({
        url: `/nvr/record/label/list`,
        method: 'POST',
        data
    })
}

// 修改标签名
export async function editTag( data ) {
    return request({
        url: `/nvr/record/label/${data.id}`,
        method: 'PUT',
        data
    })
}

// 删除标签
export async function deleteTag( id ) {
    return request({
        url: `/nvr/record/label/${id}`,
        method: 'DELETE'
    })
}

// 录像导出备份
export async function explorerMng(oper, data) {
    return request({
        url: `/nvr/record/export/explorer/${oper}`,
        method: 'POST',
        data
    })
}

// 录像导出备份
export async function explorerMng9(oper, data) {
    return request({
        url: `/nvr/record/export/explorer/${oper}`,
        method: 'POST',
        responseType: 'blob',
        data
    })
}

/**
 * 查询通道云台轨迹
 * @param {*} channelId 
 * @returns 
 */
export async function queryPatternByChannelId(channelId) {
    return request({
        url: `/nvr/preview/ptz/pattern/${channelId}`,
        cancelToken: source.token
    })
}

/**
 * 录制通道云台轨迹
 * @param {*} channelId 
 * @param {*} data 
 * @returns 
 */
export async function updatePatternByChannelId(channelId, data) {
    return request({
        url: `/nvr/preview/ptz/pattern/${channelId}`,
        method: 'PUT',
        data
    })
}

/**
 * 调用通道云台轨迹
 * @param {*} channelId 
 * @param {*} data 
 * @returns 
 */
export async function callPatternByChannelId(channelId, data) {
    return request({
        url: `/nvr/preview/ptz/pattern/${channelId}`,
        method: 'POST',
        data
    })
}

/**
 * 查询通道云台巡航路径
 * @param {*} params channelId
 * @returns 
 */
export async function queryTourByChannelId(channelId) {
    return request({
        url: `/nvr/preview/ptz/tour/${channelId}`,
        cancelToken: source.token
    })
}

/**
 * 更新通道云台巡航路径
 * @param {*} channelId 
 * @param {*} data 
 * @returns 
 */
export async function updateTourByChannelId(channelId, data) {
    return request({
        url: `/nvr/preview/ptz/tour/${channelId}`,
        method: 'PUT',
        data
    })
}

/**
 * 调用通道云台巡航路径
 * @param {*} channelId 
 * @param {*} data 
 * @returns 
 */
export async function callTourByChannelId(channelId, data) {
    return request({
        url: `/nvr/preview/ptz/tour/${channelId}`,
        method: 'POST',
        data
    })
}

/**
 * 添加通道云台预置位 - 重设预置点名称
 * @param {*} channelId 
 * @param {*} data 
 * @returns 
 */
export async function editPresetByChannelId(channelId, data) {
    return request({
        url: `/nvr/preview/ptz/preset/${channelId}`,
        method: 'PUT',
        data
    })
}