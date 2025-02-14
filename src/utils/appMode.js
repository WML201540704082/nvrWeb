import axios from "axios"

let APPMODE_CONFIG = {
  Login: {
    logo: false
  },
  NavForm: {
    title: false
  },
  FilterForm: {
    export: false
  },
  Lib: {
    operation: false
  },
  Channel: {
    add: false,
    dialog: false
  },
  Device: {
    info: false
  },
  Settings: {
    iotServer: false,
    uploadServer: false,
    eventServer: false,
    ga_t1400: false,
    vseServer: false,
    gasServer: false,
    relayServer: false,
    soundServer: false,
    godView: false, // 上帝视角
    algoView: false, // 算法设置
    behavioral: false, // 行为警戒
    bound: false, // 周界警戒
    out_enter_leaveAlgo: false,//越界进入离开三个算法
    channelBatch: false,//通道批量处理,只有单兵模式没有
    algoUsage: false,//算法容量
    fullAlgoView: false,//全目标算法设置页面
    gsAlgoView: false,//单兵算法设置页面
    gpAlgoView: false,//gp算法设置页面
    algSet: false,//应用设置算法设置页面
    frpSet: false,//frp设置页面
    storageSet: false,//存储设置
    npuSet: false,//告警设置
  },
  Appset: {
    logo: false
  },
  Reboot: {
    remote: false,
    upgrade: false
  },
  Upgrade: {
    operation: false
  },
  APP_MODE: '',//龙湖样式修改需要
}

export const getAppMode = async function () {
  const res = await axios.get('/api/system/appMode')
  const APP_MODE = res.data.data
  // const APP_MODE = 'cu'
  switch (APP_MODE) {
    case 'cu'://联通
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.Login.logo = true
      APPMODE_CONFIG.Settings.iotServer = true
      APPMODE_CONFIG.Settings.uploadServer = true
      APPMODE_CONFIG.Settings.vseServer = true
      APPMODE_CONFIG.Settings.algoView = false
      APPMODE_CONFIG.Settings.storageSet = true
      APPMODE_CONFIG.Settings.npuSet = true
      APPMODE_CONFIG.Settings.channelBatch = true
      break;
    case 'lf'://龙湖
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.Login.logo = true
      APPMODE_CONFIG.Settings.iotServer = true
      APPMODE_CONFIG.Settings.uploadServer = true
      APPMODE_CONFIG.Settings.vseServer = true
      APPMODE_CONFIG.Settings.frpSet = true
      APPMODE_CONFIG.Settings.algoView = false
      APPMODE_CONFIG.Settings.storageSet = false
      APPMODE_CONFIG.Settings.channelBatch = true
      break;
    case 'debug':
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.Login.logo = true
      APPMODE_CONFIG.Settings.iotServer = true
      APPMODE_CONFIG.Settings.uploadServer = true
      APPMODE_CONFIG.Settings.eventServer = true
      APPMODE_CONFIG.Settings.ga_t1400 = true
      APPMODE_CONFIG.Settings.vseServer = true
      APPMODE_CONFIG.Settings.gasServer = true
      APPMODE_CONFIG.Settings.relayServer = true
      APPMODE_CONFIG.Settings.soundServer = true
      APPMODE_CONFIG.Reboot.upgrade = true
      APPMODE_CONFIG.Settings.godView = true
      APPMODE_CONFIG.Settings.algoView = true
      APPMODE_CONFIG.Settings.behavioral = true
      APPMODE_CONFIG.Settings.storageSet = true
      APPMODE_CONFIG.Settings.npuSet = true
      APPMODE_CONFIG.Settings.channelBatch = true
      break;
    case 'full'://全目标
    case 'face'://人脸
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.Login.logo = true
      APPMODE_CONFIG.Settings.iotServer = true
      APPMODE_CONFIG.Settings.uploadServer = true
      APPMODE_CONFIG.Settings.ga_t1400 = true
      APPMODE_CONFIG.Settings.vseServer = true
      APPMODE_CONFIG.Settings.relayServer = true
      APPMODE_CONFIG.Settings.soundServer = true
      APPMODE_CONFIG.Reboot.upgrade = true
      APPMODE_CONFIG.Settings.algoView = true
      APPMODE_CONFIG.Settings.fullAlgoView = true
      APPMODE_CONFIG.Settings.storageSet = true
      APPMODE_CONFIG.Settings.npuSet = true
      APPMODE_CONFIG.Settings.channelBatch = true
      break;
    case 'gp'://通用
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.Login.logo = true
      APPMODE_CONFIG.Settings.iotServer = true
      APPMODE_CONFIG.Settings.uploadServer = true
      APPMODE_CONFIG.Settings.ga_t1400 = true
      APPMODE_CONFIG.Settings.vseServer = true
      APPMODE_CONFIG.Settings.relayServer = true
      APPMODE_CONFIG.Settings.soundServer = true
      APPMODE_CONFIG.Reboot.upgrade = true
      APPMODE_CONFIG.Settings.algoView = true
      APPMODE_CONFIG.Settings.gpAlgoView = true
      APPMODE_CONFIG.Settings.storageSet = true
      APPMODE_CONFIG.Settings.npuSet = true
      APPMODE_CONFIG.Settings.channelBatch = true
    case 'l4ab'://农行
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.Login.logo = true
      APPMODE_CONFIG.Lib.operation = true
      APPMODE_CONFIG.Channel.dialog = true
      APPMODE_CONFIG.Settings.iotServer = true
      APPMODE_CONFIG.Settings.eventServer = true
      APPMODE_CONFIG.Reboot.upgrade = true
      APPMODE_CONFIG.Settings.algoView = true
      APPMODE_CONFIG.Settings.behavioral = true
      APPMODE_CONFIG.Settings.channelBatch = true
      APPMODE_CONFIG.Settings.storageSet = true
      APPMODE_CONFIG.Settings.npuSet = true
      APPMODE_CONFIG.Settings.algSet = true
      break;
    case 'l4t'://老农行
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.NavForm.title = true
      APPMODE_CONFIG.Lib.operation = true
      APPMODE_CONFIG.Channel.dialog = true
      APPMODE_CONFIG.Device.info = true
      APPMODE_CONFIG.Settings.iotServer = true
      APPMODE_CONFIG.Settings.eventServer = true
      APPMODE_CONFIG.Reboot.remote = true
      APPMODE_CONFIG.Appset.logo = true
      APPMODE_CONFIG.Reboot.upgrade = true
      APPMODE_CONFIG.Upgrade.operation = true
      APPMODE_CONFIG.Settings.algoView = false
      APPMODE_CONFIG.Settings.channelBatch = true
      break;
    case 'l4as'://体育
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.Login.logo = true
      APPMODE_CONFIG.Lib.operation = true
      APPMODE_CONFIG.Channel.dialog = true
      APPMODE_CONFIG.Settings.iotServer = true
      APPMODE_CONFIG.Settings.eventServer = true
      APPMODE_CONFIG.Reboot.upgrade = true
      APPMODE_CONFIG.Settings.algoView = false
      APPMODE_CONFIG.Settings.channelBatch = true
      break;
    case 'gs'://单兵
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.Login.logo = true
      APPMODE_CONFIG.FilterForm.export = true
      APPMODE_CONFIG.Channel.add = true
      APPMODE_CONFIG.Settings.gasServer = true
      APPMODE_CONFIG.Settings.algoView = true
      APPMODE_CONFIG.Settings.gsAlgoView = true
      APPMODE_CONFIG.Settings.storageSet = true
      APPMODE_CONFIG.Settings.npuSet = true
      break;
    case 'cb'://建行
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.Login.logo = true
      APPMODE_CONFIG.Settings.iotServer = true
      APPMODE_CONFIG.Settings.uploadServer = true
      APPMODE_CONFIG.Settings.eventServer = true
      APPMODE_CONFIG.Settings.ga_t1400 = true
      APPMODE_CONFIG.Settings.vseServer = true
      APPMODE_CONFIG.Settings.relayServer = true
      APPMODE_CONFIG.Settings.soundServer = true
      APPMODE_CONFIG.Reboot.upgrade = true
      APPMODE_CONFIG.Settings.algoView = false
      APPMODE_CONFIG.Settings.storageSet = true
      APPMODE_CONFIG.Settings.npuSet = true
      APPMODE_CONFIG.Settings.channelBatch = true
      break;
    case 'qf'://千方定制
      APPMODE_CONFIG.APP_MODE = APP_MODE
      APPMODE_CONFIG.Login.logo = true
      APPMODE_CONFIG.Settings.iotServer = true
      APPMODE_CONFIG.Settings.ga_t1400 = true
      APPMODE_CONFIG.Settings.vseServer = true
      APPMODE_CONFIG.Settings.relayServer = true
      APPMODE_CONFIG.Settings.soundServer = true
      APPMODE_CONFIG.Reboot.upgrade = true
      APPMODE_CONFIG.Settings.godView = true
      APPMODE_CONFIG.Settings.algoView = false
      APPMODE_CONFIG.Settings.channelBatch = true
      break;
    case 'fbp'://比特大陆
        APPMODE_CONFIG.APP_MODE = APP_MODE
        APPMODE_CONFIG.Login.logo = true
        APPMODE_CONFIG.Lib.operation = true
        APPMODE_CONFIG.Channel.dialog = true
        APPMODE_CONFIG.Settings.iotServer = true
        APPMODE_CONFIG.Settings.eventServer = true
        APPMODE_CONFIG.Reboot.upgrade = true
        APPMODE_CONFIG.Settings.algoView = true
        APPMODE_CONFIG.Settings.behavioral = true
        APPMODE_CONFIG.Settings.bound = true
        APPMODE_CONFIG.Settings.out_enter_leaveAlgo = true
        APPMODE_CONFIG.Settings.algoUsage = true
        APPMODE_CONFIG.Settings.channelBatch = true
        break;
  }
  
  return APPMODE_CONFIG
}