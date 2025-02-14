/*
 * @Author: Stephen
 * @Date: 2019-11-14 18:45:49
 * @LastEditors: Stephen
 * @LastEditTime: 2019-12-04 11:41:35
 */
import { commonList, faceList, pedestrianList, vehicleList, nonmotorList } from '../utils/listMap.js'

const json = {
  faceTypeList: {
    all: {
      label: 'all',
      width: '22px',
      index: ''
    },
    alarmInComparison: {
      label: 'alarmInComparison',
      width: '46px',
      index: 1
    },
    StrangerAlarm: {
      label: 'StrangerAlarm',
      width: '56px',
      index: 2
    },
    StrangerWarn: {
      label: 'StrangerWarn',
      width: '32px',
      index: 3
    },
    SuspectedWarn: {
      label: 'SuspectedWarn',
      width: '46px',
      index: 4
    },
    AbnormalWarn: {
      label: 'AbnormalWarn',
      width: '46px',
      index: 5
    }
  },
  vehicleTypeList: {
    all: {
      label: 'all',
      width: '22px',
      index: ''
    },
    alarmInComparison: {
      label: 'alarmInComparison',
      width: '46px',
      index: 1
    },
    StrangerAlarm: {
      label: 'alarmNotInComparison',
      width: '56px',
      index: 2
    },
    StrangerWarn: {
      label: 'StrangerWarn',
      width: '32px',
      index: 3
    }
  },
  // 人脸
  faceList: {
    time: {
      label: 'time',
      type: 'time',
      span: 6,
      offset: 0,
      list: commonList.time
    },
    camera: {
      label: 'camera',
      type: 'multiSelect',
      span: 6,
      offset: 2,
    },
    gender: {
      label: 'gender',
      type: 'span',
      span: 6,
      offset: 2,
      list: faceList.gender
    },
    mask: {
      label: 'mask',
      type: 'span',
      span: 6,
      offset: 0,
      list: faceList.mask
    },
    glass: {
      label: 'glass',
      type: 'span',
      span: 6,
      offset: 2,
      list: faceList.glass
    },
    hat: {
      label: 'hat',
      type: 'span',
      span: 6,
      offset: 2,
      list: faceList.hat
    },
  },
  // 行人
  pedestrianList: {
    time: {
      label: 'time',
      type: 'time',
      span: 6,
      offset: 0,
      list: commonList.time
    },
    camera: {
      label: 'camera',
      type: 'multiSelect',
      span: 6,
      offset: 2,
    },
    gender: {
      label: 'gender',
      type: 'span',
      span: 6,
      offset: 2,
      list: pedestrianList.gender
    },
    age: {
      label: 'age',
      type: 'select',
      span: 6,
      offset: 0,
      list: pedestrianList.age
    },
    upperColor: {
      label: 'upperColor',
      type: 'select',
      span: 6,
      offset: 2,
      list: commonList.color
    },
    lowerColor: {
      label: 'lowerColor',
      type: 'select',
      span: 6,
      offset: 2,
      list: commonList.color
    }
  },
  // 机动车
  vehicleList: {
    time: {
      label: 'time',
      type: 'time',
      span: 6,
      offset: 0,
      list: commonList.time
    },
    camera: {
      label: 'camera',
      type: 'multiSelect',
      span: 6,
      offset: 2,
    },
    vehicleID: {
      label: 'vehicleID',
      type: 'input',
      span: 6,
      offset: 2,
      placeholder: 'pleaseEnterVehicleID'
    },
    type: {
      label: 'type',
      type: 'select',
      span: 6,
      offset: 0,
      list: vehicleList.type
    },
    brand: {
      label: 'brand',
      type: 'cascader',
      span: 6,
      offset: 2
    },
    carColor: {
      label: 'carColor',
      type: 'select',
      span: 6,
      offset: 2,
      list: vehicleList.carColor
    },
    plateColor: {
      label: 'plateColor',
      type: 'select',
      span: 6,
      offset: 0,
      list: vehicleList.plateColor
    },
    pose: {
      label: 'pose',
      type: 'select',
      span: 6,
      offset: 2,
      list: vehicleList.pose
    }
  },
  // 非机动车
  nonmotorList: {
    time: {
      label: 'time',
      type: 'time',
      span: 6,
      offset: 0,
      list: commonList.time
    },
    camera: {
      label: 'camera',
      type: 'multiSelect',
      span: 6,
      offset: 2,
    },
    transportation: {
      label: 'transportation',
      type: 'select',
      span: 6,
      offset: 2,
      list: nonmotorList.typeList
    },
    transportationColor: {
      label: 'transportationColor',
      type: 'select',
      span: 6,
      offset: 0,
      list: commonList.color
    },
    attitude: {
      label: 'attitude',
      type: 'select',
      span: 6,
      offset: 2,
      list: nonmotorList.attitudeList
    }
  }
}

export default json
