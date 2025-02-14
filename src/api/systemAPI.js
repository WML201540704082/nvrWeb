import { request } from './request';
import { source } from '@/api/request.js';

//通道配置-----------开始
export async function getProtocolCustom() {
    return request({
        url: '/nvr/protocol/custom',
        method: 'get',
    })
}
export async function putProtocolCustom(data) {
    return request({
        url: '/nvr/protocol/custom',
        method: 'put',
        data
    })
}
export async function getProtocolgb28(ID) {
    return request({
        url: '/nvr/protocol/gb28181',
        method: 'get',
    })
}
export async function putProtocolgb28(data) {
    return request({
        url: '/nvr/protocol/gb28181',
        method: 'put',
        data
    })
}
export async function getDevSearch() {
    return request({
        url: '/nvr/dev/search',
        method: 'post',
    })
}

export async function getChannel() {
    return request({
        url: '/nvr/channel',
        method: 'get',
    })
}
export async function getChannels() {
    return request({
        url: `/channel?pageSize=99`,
        method: 'get',
    })
}
export async function getChannelDet(ID) {
    return request({
        url: `/channel/${ID}`,
        method: 'get',
    })
}
export async function getChannelPic(ID) {
    return request({
        url: `/channel/${ID}/instantFrame`,
        method: 'get',
    })
}
export async function getChannelTask(ID) {
    return request({
        url: `/channel/${ID}/task`,
        method: 'get',
    })
}
export async function putChannelTask(ID, data) {
    return request({
        url: `/channel/${ID}/task`,
        method: 'put',
        data
    })
}
export async function putChannelIpcTime(ID, data) {
    return request({
        url: `/nvr/channel/${ID}/ipctime`,
        method: 'put',
        data
    })
}
export async function getChannelDef(ID) {
    return request({
        url: `/nvr/channel/${ID}/defense`,
        method: 'get',
    })
}
export async function getChannelTamper(ID) {
    return request({
        url: `/nvr/channel/${ID}/analytics/tamper`,
        method: 'get',
    })
}
export async function putChannelTamper(ID, data) {
    return request({
        url: `/nvr/channel/${ID}/analytics/tamper`,
        method: 'put',
        data
    })
}
export async function getChannelMotion(ID) {
    return request({
        url: `/nvr/channel/${ID}/analytics/motion`,
        method: 'get',
    })
}
export async function putChannelMotion(ID, data) {
    return request({
        url: `/nvr/channel/${ID}/analytics/motion`,
        method: 'put',
        data
    })
}
export async function getVideoLose(ID) {
    return request({
        url: `/nvr/channel/${ID}/analytics/videolose`,
        method: 'get',
    })
}
export async function putVideoLose(ID, data) {
    return request({
        url: `/nvr/channel/${ID}/analytics/videolose`,
        method: 'put',
        data
    })
}
export async function getDefense() {
    return request({
        url: '/nvr/system/defense',
        method: 'get'
    })
}
export async function putDefense(data) {
    return request({
        url: '/nvr/system/defense',
        method: 'put',
        data
    })
}
export async function putChannels(ID, data) {
    return request({
        url: `/channel/${ID}`,
        method: 'put',
        data
    })
}
export async function putChannelDef(ID, data) {
    return request({
        url: `/nvr/channel/${ID}/defense`,
        method: 'put',
        data
    })
}
export async function putChannel(ID, data) {
    return request({
        url: `/nvr/channel/${ID}`,
        method: 'put',
        data
    })
}
export async function postChannel(data) {
    return request({
        url: '/nvr/channel',
        method: 'post',
        data
    })
}
export async function putChannelEnable(id, data) {
    return request({
        url: `/channel/${id}/enabled`,
        method: 'put',
        data
    })
}
export async function deleteChannel(data) {
    return request({
        url: '/nvr/channel',
        method: 'delete',
        data
    })
}
export async function postDevreboot(ID) {
    return request({
        url: `/nvr/channel/${ID}/devreboot`,
        method: 'post',
    })
}

export async function getChannelList(params) {
    return request({
        url: '/nvr/preview/channel',
        params,
    })
}

export async function putPtzCtrl(ID, data) {
    return request({
        url: `/nvr/preview/ptz/ctrl/${ID}`,
        method: 'put',
        data
    })
}

export async function getPresets(ID) {
    return request({
        url: `/nvr/preview/ptz/preset/${ID}`,
        method: 'get',
        cancelToken: source.token
    })
}

export async function gotoPreset(ID, data) {
    return request({
        url: `/nvr/preview/ptz/preset/${ID}`,
        method: 'post',
        data
    })
}

export async function setPreset(ID, data) {
    return request({
        url: `/nvr/preview/ptz/preset/${ID}`,
        method: 'put',
        data
    })
}

export async function addChannel(data) {
    return request({
        url: '/nvr/channel',
        method: 'POST',
        data,
    })
}

export async function previewParamsModify(data) {
    return request({
        url: `/nvr/preview/channel/${data.id}`,
        method: 'PUT',
        data
    })
}
//通道配置-----------结束


//码流配置-----------开始

export async function getBitstreamParam(channelId, bitstream) {
    return request({
        url: `/nvr/channel/${channelId}/abilitylistbystream/${bitstream}`,
        method: 'get'
    })
}
export async function getStreamparaParam(channelId, bitstream) {
    return request({
        url: `/nvr/channel/${channelId}/streampara/${bitstream}`,
        method: 'get'
    })
}
export async function putStreamparaParam(channelId, bitstream, data) {
    return request({
        url: `/nvr/channel/${channelId}/streampara/${bitstream}`,
        method: 'put',
        data
    })
}
export async function getPicpara(channelId) {
    return request({
        url: `/nvr/channel/${channelId}/picpara`,
        method: 'get',
    })
}
export async function putPicpara(channelId, data) {
    return request({
        url: `/nvr/channel/${channelId}/picpara`,
        method: 'put',
        data
    })
}
//码流配置-----------结束

//叠加配置-----------开始
export async function getOsdoverly(channelId) {
    return request({
        url: `/nvr/channel/${channelId}/osdoverlying`,
        method: 'get'
    })
}
export async function putOsdoverly(channelId, data) {
    return request({
        url: `/nvr/channel/${channelId}/osdoverlying`,
        method: 'put',
        data
    })
}

export async function getImagemask(channelId) {
    return request({
        url: `/nvr/channel/${channelId}/imagemask`,
        method: 'get'
    })
}
export async function putImagemask(channelId, data) {
    return request({
        url: `/nvr/channel/${channelId}/imagemask`,
        method: 'put',
        data
    })
}

export async function getSnapshot(channelId) {
    return request({
        url: `/nvr/channel/${channelId}/snapshot`,
        method: 'get'
    })
}

export async function getImageopt(channelId) {
    return request({
        url: `/nvr/channel/${channelId}/imageopt`,
        method: 'get'
    })
}
export async function getImagecfg(channelId) {
    return request({
        url: `/nvr/channel/${channelId}/imagecfg`,
        method: 'get'
    })
}
export async function putImagecfg(channelId, data) {
    return request({
        url: `/nvr/channel/${channelId}/imagecfg`,
        method: 'put',
        data
    })
}

//叠加配置-----------结束


//录像计划-----------开始
export async function getVideoPlan(ID) {
    return request({
        url: `/nvr/record/video/plan/${ID}`,
        method: 'get',
    })
}
export async function putVideoPlan(ID, data) {
    return request({
        url: `/nvr/record/video/plan/${ID}`,
        method: 'put',
        data
    })
}
//录像计划-----------结束


//抓拍计划-----------开始
export async function getPicturePlan(ID) {
    return request({
        url: `/nvr/record/picture/plan/${ID}`,
        method: 'get',
    })
}
export async function putPicturePlan(ID, data) {
    return request({
        url: `/nvr/record/picture/plan/${ID}`,
        method: 'put',
        data
    })
}
//抓拍计划-----------结束

//通用参数-----------开始
const PackParam_url = ''
export async function getChannelParam(ID) {
    return request({
        url: `/nvr/record/param/channel/${ID}`,
        method: 'get',
    })
}
export async function putChannelParam(ID, data) {
    return request({
        url: `/nvr/record/param/channel/${ID}`,
        method: 'put',
        data
    })
}
export async function getPackParam() {
    return request({
        url: `/nvr/record/param/pack`,
        method: 'get',
    })
}
export async function putPackParam(data) {
    return request({
        url: `/nvr/record/param/pack`,
        method: 'put',
        data
    })
}
//通用参数-----------结束

//硬盘管理-----------开始
export async function getDiskInfo() {
    return request({
        url: '/nvr/storage/diskinfo',
        method: 'get',
    })
}
export async function putDiskinfo(data) {
    return request({
        url: '/nvr/storage/diskinfo',
        method: 'put',
        data
    })
}
export async function postFormat(ID) {
    return request({
        url: `/nvr/storage/format/${ID}`,
        method: 'post',
    })
}
export async function postDiskDir() {
    return request({
        url: '/nvr/storage/disk/dir',
        method: 'post',
    })
}
export async function getAdvanced() {
    return request({
        url: '/nvr/storage/params/advanced',
        method: 'get',
    })
}
export async function putAdvanced(data) {
    return request({
        url: '/nvr/storage/params/advanced',
        method: 'put',
        data,
    })
}
export async function postEstimateTime(data) {
    return request({
        url: '/nvr/storage/estimate/time',
        method: 'post',
        data
    })
}
export async function postEstimateCapacity(data) {
    return request({
        url: '/nvr/storage/estimate/capacity',
        method: 'post',
        data
    })
}
export async function DeleteDiskDir(ID) {
    return request({
        url: '/api/nvr/storage/disk/dir/',
        method: 'delete',
    })
}

//硬盘管理-----------结束


//存储模式-----------开始
export async function getStorageMode() {
    return request({
        url: '/nvr/storage/mode',
        method: 'get'
    })
}
export async function putStorageMode(data) {
    return request({
        url: '/nvr/storage/mode',
        method: 'put',
        data
    })
}

export async function getStorageGroup() {
    return request({
        url: '/nvr/storage/group',
        method: 'get'
    })
}
export async function putStorageGroup(data) {
    return request({
        url: '/nvr/storage/group',
        method: 'put',
        data
    })
}

export async function getStorageQuota() {
    return request({
        url: '/nvr/storage/quota',
        method: 'get'
    })
}
export async function putStorageQuota(data) {
    return request({
        url: '/nvr/storage/quota',
        method: 'put',
        data
    })
}


//存储模式-----------结束


//RAID管理-----------开始
export async function getStorageRaid() {
    return request({
        url: '/nvr/storage/raid',
        method: 'get'
    })
}
export async function postStorageRaid(data) {
    return request({
        url: '/nvr/storage/raid',
        method: 'post',
        data
    })
}
export async function deleteStorageRaid(id) {
    return request({
        url: `/nvr/storage/raid/${id}`,
        method: 'delete'
    })
}
export async function getDiskraidinfo() {
    return request({
        url: '/nvr/storage/raid/diskraidinfo',
        method: 'get'
    })
}
export async function getDevinfo() {
    return request({
        url: '/nvr/storage/disk/devinfo',
        method: 'get'
    })
}

export async function setStorageRaidSpare(id, data) {
    return request({
        url: `/nvr/storage/raid/spare/${id}`,
        method: 'put',
        data
    })
}
export async function deleteStorageRaidSpare(id, data) {
    return request({
        url: `/nvr/storage/raid/spare/${id}`,
        method: 'delete',
        data
    })
}
export async function scanZfs() {
    return request({
        url: '/nvr/storage/scanzfs',
        method: 'post'
    })
}
//RAID管理-----------结束


//硬盘检查-----------开始
export async function getDiskSmartInfo() {
    return request({
        url: '/nvr/storage/disk/smart/check',
        method: 'post',
    })
}

//硬盘检查-----------结束


//报警管理-----------开始
export async function getAlarmManagement() {
    return request({
        url: '/nvr/event/alarm/management',
        method: 'get'
    })
}
export async function postAlarmManagement(data) {
    return request({
        url: '/nvr/event/alarm/management',
        method: 'post',
        data
    })
}
export async function putAlarmManagement(data) {
    return request({
        url: '/nvr/event/alarm/management',
        method: 'put',
        data
    })
}
export async function deleteAlarmManagement(data) {
    return request({
        url: '/nvr/event/alarm/management',
        method: 'delete',
        data
    })
}
export async function getGpioIn() {
    return request({
        url: '/nvr/event/alarm/gpio/in',
        method: 'get'
    })
}
export async function getGpioOut() {
    return request({
        url: '/nvr/event/alarm/gpio/out',
        method: 'get'
    })
}
export async function getAlarmInput(ID) {
    return request({
        url: `/nvr/event/alarm/management/input?id=${ID}`,
        method: 'get',
    })
}
export async function postAlarmInput(data) {
    return request({
        url: '/nvr/event/alarm/management/input',
        method: 'post',
        data
    })
}
export async function getAlarmOutput(ID) {
    return request({
        url: `/nvr/event/alarm/management/output?id=${ID}`,
        method: 'get'
    })
}
export async function postAlarmOutput(data) {
    return request({
        url: '/nvr/event/alarm/management/output',
        method: 'post',
        data
    })
}
export async function getIpgpioIn() {
    return request({
        url: '/nvr/event/alarm/ipgpio/in',
        method: 'get'
    })
}
export async function getIpgpioOut() {
    return request({
        url: '/nvr/event/alarm/ipgpio/out',
        method: 'get'
    })
}

//报警管理-----------结束

//更多设置

export async function putMoreConfig(data) {
    return request({
        url: '/nvr/system/moreConfig',
        method: 'put',
        data
    })
}
export async function getMoreConfig() {
    return request({
        url: '/nvr/system/moreConfig',
        method: 'get'
    })
}

//设备信息-----------开始
export async function getDeviceInfo() {
    return request({
        url: '/system/deviceinfo',
        method: 'get'
    })
}
export async function setDeviceInfo(data) {
    return request({
        url: '/system/deviceinfo',
        method: 'put',
        data
    })
}
export async function setDeviceTitle(data) {
    return request({
        url: '/system/logo',
        method: 'put',
        data
    })
}
export async function getSysteminfo() {
    return request({
        url: '/system/systeminfo',
        method: 'get'
    })
}

export async function getNVRDeviceInfo() {
    return request({
        url: '/nvr/maintenance/deviceinfo',
        method: 'get'
    })
}

export async function systemReboot() {
    return request({
        url: '/system/reboot',
        method: 'post'
    })
}

export async function systemReset() {
    return request({
        url: '/system/reset',
        method: 'post'
    })
}

export async function setRebootConfig(data) {
    return request({
        url: '/nvr/maintenance/device/rebootconfig',
        method: 'put',
        data
    })
}
export async function getRebootConfig() {
    return request({
        url: '/nvr/maintenance/device/rebootconfig',
        method: 'get'
    })
}

export async function getBackupDb() {
    return request({
        url: '/nvr/maintenance/backup/db',
        method: 'get'
    })
}

export async function postBackupDb(data) {
    return request({
        url: '/nvr/maintenance/backup/db',
        method: 'post',
        data
    })
}
//产品维护-----------结束
//设备恢复-----------开始
export function getBackUpsConfig() {
    return request({
        url: '/nvr/maintenance/db/backup/config',
        method: 'get'
    })
}
export function getBackUpsList() {
    return request({
        url: '/nvr/maintenance/db/backup',
        method: 'get'
    })
}
export async function recovery(data) {
    return request({
        url: '/nvr/maintenance/db/backup',
        method: 'post',
        data
    })
}
export async function restore(data) {
    return request({
        url: '/nvr/maintenance/db/backup/restore',
        method: 'post',
        data
    })
}
export function exportDeviceData(data) {
    return request({
        url: '/nvr/maintenance/db/backup/export',
        method: 'post',
        responseType: 'blob',
        data
    })
}
export function upLoadData(data) {
    return request({
        url: '/nvr/maintenance/db/backup/import',
        method: 'post',
        data,
    })
}
export function getConfigSelected() {
    return request({
        url: '/nvr/storage/raid',
        method: 'get',
    })
}
export function deleteList(data) {
    return request({
        url: '/nvr/maintenance/db/backup',
        method: 'delete',
        data
    })
}
export function userConfigs(data) {
    return request({
        url: '/nvr/maintenance/db/backup/config',
        method: 'post',
        data
    })
}
export function saveConfig(data) {
    return request({
        url: '/nvr/maintenance/db/backup/config',
        method: 'post',
        data
    })
}
