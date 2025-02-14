const json = {
  basicForm: [
    {
      label: 'model',
      type: 'select',
      prop: 'model',
    },
    {
      label: 'name',
      type: 'input',
      valueType: 'String',
      prop: 'name',
    },
    {
      label: 'url',
      type: 'input',
      tip: true,
      content: 'urlRemark',
      valueType: 'String',
      prop: 'url',
    },
    {
      label: 'userName',
      type: 'input',
      valueType: 'String',
      prop: 'userName',
    },
    {
      label: 'password',
      type: 'input',
      valueType: 'String',
      prop: 'password',
    },
    {
      label: 'deviceCode',
      type: 'input',
      valueType: 'ID',
      prop: 'id'
    },
    {
      label: 'longAndLati',
      type: 'long'
    },
    {
      label: 'description',
      type: 'textarea',
      prop: 'description'
    }
  ],
  configForm: [
    {
      label: 'detectMode',
      type: 'mode',
      valueType: 'Number',
      prop: 'detectMode',
      list: [ { label: 'fastest'}, { label: 'optimal'}]
    },
    {
      label: 'trackSeconds',
      type: 'input',
      tip: true,
      content: 'trackSecondsRemark',
      valueType: 'Number',
      prop: 'trackSeconds'
    },
    // {
    //   label: 'skeletonInterval',
    //   type: 'input',
    //   tip: true,
    //   content: 'skeletonIntervalRemark',
    //   valueType: 'Number',
    //   prop: 'skeletonInterval'
    // },
  ],
  // 人脸
  face: [
    {
      label: '人脸质量',
      type: 'input',
      tip: true,
      content: '注: 低于人脸质量会过滤,取值范围【0-1】,建议值0.5',
      valueType: 'Number',
      prop: 'quality'
    },
    {
      label: '人脸置信度',
      type: 'input',
      tip: true,
      content: '注: 低于人脸置信度会过滤,取值范围【0-1】,建议值0.3',
      valueType: 'Number',
      prop: 'confidence'
    },
    {
      label: 'blur',
      type: 'input',
      tip: true,
      content: '注: 低于图片模糊程度会过滤,取值范围【0-1】,建议值0.1',
      valueType: 'Number',
      prop: 'blur'
    },
    {
      label: 'yaw',
      type: 'input',
      tip: true,
      content: '注: 头左右偏转角度,取值范围【1-45】,建议值30',
      valueType: 'Number',
      prop: 'yaw'
    },
    {
      label: 'pitch',
      type: 'input',
      tip: true,
      content: '注: 低头、抬头角度,取值范围【1-45】,建议值30',
      valueType: 'Number',
      prop: 'pitch'
    },
    {
      label: 'roll',
      type: 'input',
      tip: true,
      content: '注: 头斜向倾斜角度,取值范围【1-45】,建议值15',
      valueType: 'Number',
      prop: 'roll'
    }
  ],
  // 行人
  pedestrian: [
    {
      label: '人体质量',
      type: 'input',
      tip: true,
      content: '注: 低于人体质量会过滤,取值范围【0-1】,建议值0.1',
      valueType: 'Number',
      prop: 'quality'
    },
    {
      label: '人体置信度',
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】,建议值0.7',
      valueType: 'Number',
      prop: 'confidence'
    }
  ],
  // 机动车
  vehicle: [
    {
      label: '车辆质量',
      type: 'input',
      tip: true,
      content: '注: 低于车辆质量会过滤,取值范围【0-1】,建议值0.1',
      valueType: 'Number',
      prop: 'quality'
    },
    {
      label: '车辆置信度',
      type: 'input',
      tip: true,
      content: '注: 低于车辆置信度会过滤,取值范围【0-1】,建议值0.7',
      valueType: 'Number',
      prop: 'confidence'
    },
    {
      label: 'localPlate',
      type: 'select',
      tip: true,
      content: 'vlocalPlate',
      valueType: 'String',
      prop: 'localPlate'
    },
    {
      label: 'localPlateConfidence',
      type: 'input',
      tip: true,
      content: '注: 低于本地车牌阈值,使用本地车牌替换,取值范围【0.3-1】,建议值0.4',
      valueType: 'Number',
      prop: 'localPlateConfidence'
    },
  ],
  // 非机动车
  nonmotor: [
    {
      label: '非机动车质量',
      type: 'input',
      tip: true,
      content: '注: 低于非机动车质量会过滤,取值范围【0-1】,建议值0.1',
      valueType: 'Number',
      prop: 'quality'
    },
    {
      label: '非机动车置信度',
      type: 'input',
      tip: true,
      content: '注: 低于非机动车置信度会过滤,取值范围【0-1】,建议值0.6',
      valueType: 'Number',
      prop: 'confidence'
    }
  ],
  // 拍屏
  shoot: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】,建议值0.3',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 低于电话置信度会过滤,取值范围【0-1】, 建议取值0.6',
      valueType: 'Number',
      prop: 'phoneConfidence',
      zn: '电话置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 低于屏幕置信度会过滤,取值范围【0-1】, 建议取值0.6',
      valueType: 'Number',
      prop: 'screenConfidence',
      zn: '屏幕置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】,建议值30秒',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】,建议值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 倒地
  fall: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】,建议值0.7',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】,建议值5秒',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】,建议值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 临时离柜
  cash: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.3',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 低于现金置信度会过滤,取值范围【0-1】, 建议取值0.7',
      valueType: 'Number',
      prop: 'cashConfidence',
      zn: '现金置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 人体离开时间,取值范围【10-600】, 建议取值10',
      valueType: 'Number',
      prop: 'leaveNum',
      zn: '人体离开时间'
    }
  ],
  // 打斗
  struggle: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.3',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 打斗激烈程度,取值范围【0-100】, 建议取值50',
      valueType: 'Number',
      prop: 'flowThreshold',
      zn: '激烈程度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 骨骼数人
  skeleton: [
    {
      label: 'confidence',
      type: 'input',
      tip: true,
      content: '低于置信度会过滤,取值范围【0-1】,建议值0.3',
      valueType: 'Number',
      prop: 'confidence'
    },{
      label: '数人间隔（秒）',
      type: 'input',
      tip: true,
      content: '注: 设置算法每多少秒数一次人,取值范围>=1秒,建议值5',
      valueType: 'Number',
      prop: 'interval'
    }
  ],
  // 快速移动
  fastMove: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.7',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 最大移动速度,取值范围【0-100】, 建议取值12米/秒',
      valueType: 'Number',
      prop: 'fastSpeed',
      zn: '移动速度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 遗留物
  remain: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.6',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法检测敏感值,取值范围【0-1】, 建议取值0.25',
      valueType: 'Number',
      prop: 'threshold',
      zn: '检测敏感值'
    }, {
      type: 'input',
      tip: true,
      content: '注: 人体离开时间,取值范围【10-600】, 建议取值60',
      valueType: 'Number',
      prop: 'leaveNum',
      zn: '人体离开时间'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 特殊人群
  specialPed: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.7',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 代客操作
  stm: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.7',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 超级柜台朝向，取值范围【1-4】1代表超级柜台朝上，2代表超级柜台朝下，3代表超级柜台朝左，4代表超级柜台朝右',
      valueType: 'Number',
      prop: 'direction',
      zn: '超级柜台朝向'
    }, {
    //   type: 'input',
    //   tip: true,
    //   content: '注: 取值范围【0-100】, 建议取值12',
    //   valueType: 'Number',
    //   prop: 'threshold',
    //   zn: '阈值'
    // }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 徘徊
  hover: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.7',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 人员逗留时间最大值,取值范围【0-1000】,建议值3分钟',
      valueType: 'Number',
      prop: 'duration',
      zn: '逗留时间（分）'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 箱包
  bag: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 低于箱包置信度会过滤,取值范围【0-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'bagConfidence',
      zn: '箱包置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 低于提款箱置信度会过滤,取值范围【0-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'moneyBoxConfidence',
      zn: '提款箱置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】,建议值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 摄像头移动
  ipcmove: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于阈值会过滤,取值范围【0-100】, 建议取值20',
      valueType: 'Number',
      prop: 'ipcmove_threshold',
      zn: '阈值'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // ATM柜台遗留物检查
  atmRemain: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.4',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 低于手机置信度会过滤,取值范围【0-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'phoneConfidence',
      zn: '手机置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 低于现金置信度会过滤,取值范围【0-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'cashConfidence',
      zn: '现金置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 低于银行卡置信度会过滤,取值范围【0-1】, 建议取值1',
      valueType: 'Number',
      prop: 'cardConfidence',
      zn: '银行卡置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 低于钱包置信度会过滤,取值范围【0-1】, 建议取值1',
      valueType: 'Number',
      prop: 'bagConfidence',
      zn: '钱包置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 低于钥匙置信度会过滤,取值范围【0-1】, 建议取值1',
      valueType: 'Number',
      prop: 'keyConfidence',
      zn: '钥匙置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值10',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 坐姿不雅
  recline: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.3',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 低于手机置信度会过滤,取值范围【0-1】, 建议取值0.7',
      valueType: 'Number',
      prop: 'phoneConfidence',
      zn: '手机置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 设置算法每多少秒检测一次翘腿,取值范围【0-1000】,建议值10秒',
      valueType: 'Number',
      prop: 'crossLegDuration',
      zn: '翘腿检测间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 翘腿检测间隔里检测到翘腿的次数,取值范围【1-10】,建议值2次',
      valueType: 'Number',
      prop: 'crossLegNum',
      zn: '翘腿检测次数'
    }, {
      type: 'input',
      tip: true,
      content: '注: 设置算法每多少秒检测一次睡岗,取值范围【0-1000】,建议值600秒',
      valueType: 'Number',
      prop: 'sleepDuration',
      zn: '睡岗检测间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 设置算法每多少秒检测一次玩手机,取值范围【0-1000】,建议值120秒',
      valueType: 'Number',
      prop: 'playPhoneDuration',
      zn: '玩手机检测间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 玩手机
  playPhone: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.3',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 低于手机置信度会过滤,取值范围【0-1】, 建议取值0.7',
      valueType: 'Number',
      prop: 'phoneConfidence',
      zn: '手机置信度'
    },{
      type: 'input',
      tip: true,
      content: '注: 玩手机持续时间,取值范围【0-1000】,建议值120秒',
      valueType: 'Number',
      prop: 'duration',
      zn: '持续时间（秒）'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 睡岗
  sleep: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.7',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 睡岗持续时间,取值范围【0-1000】,建议值600秒',
      valueType: 'Number',
      prop: 'time',
      zn: '持续时间（秒）'
    }, {
      type: 'input',
      tip: true,
      content: '注: 报警间隔,取值范围【0-1000】,建议值30秒',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 广告张贴
  adPost: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.3',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 低于广告置信度会过滤,取值范围【0-1】, 建议取值0.25',
      valueType: 'Number',
      prop: 'adConfidence',
      zn: '广告置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 越界侦测
  outOfBounds: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于目标质量会过滤,取值范围【0.5-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'quality',
      zn: '目标质量'
    },
    {
      type: 'input',
      tip: true,
      content: '注: 低于目标置信度会过滤,取值范围【0.3-1】, 建议取值0.7',
      valueType: 'Number',
      prop: 'confidence',
      zn: '目标置信度'
    },
    {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值50',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    },
    {
      type: 'input',
      tip: true,
      content: '注: 时间阈值,取值范围【0-10】, 建议取值5',
      valueType: 'Number',
      prop: 'detectTime',
      zn: '时间阈值'
    },
  ],
  // 进入区域侦测
  enterArea: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于目标质量会过滤,取值范围【0.5-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'quality',
      zn: '目标质量'
    },
    {
      type: 'input',
      tip: true,
      content: '注: 低于目标置信度会过滤,取值范围【0.3-1】, 建议取值0.3',
      valueType: 'Number',
      prop: 'confidence',
      zn: '目标置信度'
    },
    {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值50',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    },
    {
      type: 'input',
      tip: true,
      content: '注: 时间阈值,取值范围【0-10】, 建议取值5',
      valueType: 'Number',
      prop: 'detectTime',
      zn: '时间阈值'
    },
  ],
  // 离开区域侦测
  leaveArea: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于目标质量会过滤,取值范围【0.5-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'quality',
      zn: '目标质量'
    },
    {
      type: 'input',
      tip: true,
      content: '注: 低于目标置信度会过滤,取值范围【0.3-1】, 建议取值0.3',
      valueType: 'Number',
      prop: 'confidence',
      zn: '目标置信度'
    },
    {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值50',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    },
    {
      type: 'input',
      tip: true,
      content: '注: 时间阈值,取值范围【0-10】, 建议取值5',
      valueType: 'Number',
      prop: 'detectTime',
      zn: '时间阈值'
    },
  ],
  // 抢包
  grab: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于抢包置信度会过滤,取值范围【0-1】, 建议取值0.8',
      valueType: 'Number',
      prop: 'grabConfidence',
      zn: '抢包置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }
  ],
  // 吸烟
  smoking: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】,建议值0.3',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 低于吸烟置信度会过滤,取值范围【0-1】, 建议取值0.96',
      valueType: 'Number',
      prop: 'smokingConfidence',
      zn: '吸烟置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】, 建议取值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 人脸人体聚类
  faceClustering: [
    {
      label: '人脸质量',
      type: 'input',
      tip: true,
      content: '注: 低于人脸质量会过滤,取值范围【0-1】,建议值0.5',
      valueType: 'Number',
      prop: 'quality'
    },
    {
      label: '人脸置信度',
      type: 'input',
      tip: true,
      content: '注: 低于人脸置信度会过滤,取值范围【0-1】,建议值0.3',
      valueType: 'Number',
      prop: 'confidence'
    },
    {
      label: 'blur',
      type: 'input',
      tip: true,
      content: '注: 低于图片模糊程度会过滤,取值范围【0-1】,建议值0.1',
      valueType: 'Number',
      prop: 'blur'
    },
    {
      label: 'yaw',
      type: 'input',
      tip: true,
      content: '注: 头左右偏转角度,取值范围【1-45】,建议值30',
      valueType: 'Number',
      prop: 'yaw'
    },
    {
      label: 'pitch',
      type: 'input',
      tip: true,
      content: '注: 低头、抬头角度,取值范围【1-45】,建议值30',
      valueType: 'Number',
      prop: 'pitch'
    },
    {
      label: 'roll',
      type: 'input',
      tip: true,
      content: '注: 头斜向倾斜角度,取值范围【1-45】,建议值15',
      valueType: 'Number',
      prop: 'roll'
    }
  ],
  // 人体挟持
  hijack: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 同一目标两次有效识别间隔时间,取值范围【0-1000】, 建议取值30',
      valueType: 'Number',
      prop: 'duration',
      zn: '报警间隔'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】,建议值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 箱包交接
  swapBag: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 识别区域不少于2人的时间占比,取值范围【0-1】, 建议取值0.9',
      valueType: 'Number',
      prop: 'propertime',
      zn: '合规度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】,建议值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  // 一日两碰箱
  touchBag: [
    {
      type: 'input',
      tip: true,
      content: '注: 低于人体置信度会过滤,取值范围【0-1】, 建议取值0.5',
      valueType: 'Number',
      prop: 'pedConfidence',
      zn: '人体置信度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 识别区域不少于2人的时间占比,取值范围【0-1】, 建议取值0.9',
      valueType: 'Number',
      prop: 'propertime',
      zn: '合规度'
    }, {
      type: 'input',
      tip: true,
      content: '注: 算法识别灵敏度,取值范围【0-100】,建议值0',
      valueType: 'Number',
      prop: 'sensitivity',
      zn: '灵敏度'
    }
  ],
  cover: [
    {
      label: 'arearatio',
      type: 'input',
      tip: true,
      content: 'arearatioRemark',
      valueType: 'Number',
      prop: 'arearatio'
    }, {
      label: 'filter',
      type: 'input',
      tip: true,
      content: 'filterRemark',
      valueType: 'Number',
      prop: 'filter'
    }
  ],

// 报警时间
  formParams: {
    effectTime: {
      label: 'effectTime',
      day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      // day: [{
      //   model: 'Monday',
      //   name: 'Monday'
      // },{
      //   model: 'Tuesday',
      //   name: 'Tuesday'
      // },{
      //   model: 'Wednesday',
      //   name: 'Wednesday'
      // },{
      //   model: 'Thursday',
      //   name: 'Thursday'
      // },{
      //   model: 'Friday',
      //   name: 'Friday'
      // },{
      //   model: 'Saturday',
      //   name: 'Saturday'
      // },{
      //   model: 'Sunday',
      //   name: 'Sunday'
      // }],
      type: 'time',
      value: [[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]]
    },
    tabs: {
      type: 'tab'
    }
  },
  timeNumber: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  faceThresholdList: [{
      label: '关',
      value: 255,
    }, {
      label:'低比分报警',
      value: 0
    }, {
      label:'高比分报警',
      value: 1
    }, {
      label:'多类型报警',
      value: 2
    }, {
      label:'VIP报警',
      value: 3
    }, {
      label:'异常报警',
      value: 4
  }],
  vehicleThresholdList: [{
      label:'关',
      value: 255,
    }, {
      label:'未比中报警',
      value: 0
    }, {
      label:'比中报警',
      value: 1
    }, {
      label:'多类型报警',
      value: 2
  }],
  localPlate:[
    {
        "code": "京",
        "province": "北京",
    },
    {
        "code": "津",
        "province": "天津",
    },
    {
        "code": "沪",
        "province": "上海",
    },
    {
        "code": "渝",
        "province": "重庆",
    },
    {
        "code": "冀",
        "province": "河北",
    },
    {
        "code": "豫",
        "province": "河南",
    },
    {
        "code": "云",
        "province": "云南",
    },
    {
        "code": "辽",
        "province": "辽宁",
    },
    {
        "code": "黑",
        "province": "黑龙江",
    },
    {
        "code": "湘",
        "province": "湖南",
    },
    {
        "code": "皖",
        "province": "安徽",
    },
    {
        "code": "鲁",
        "province": "山东",
    },
    {
        "code": "新",
        "province": "新疆",
    },
    {
        "code": "苏",
        "province": "江苏",
    },
    {
        "code": "浙",
        "province": "浙江",
    },
    {
        "code": "赣",
        "province": "江西",
    },
    {
        "code": "鄂",
        "province": "湖北",
    },
    {
        "code": "桂",
        "province": "关广西",
    },
    {
        "code": "甘",
        "province": "甘肃",
    },
    {
        "code": "晋",
        "province": "山西",
    },
    {
        "code": "蒙",
        "province": "内蒙古",
    },
    {
        "code": "陕",
        "province": "陕西",
    },
    {
        "code": "吉",
        "province": "吉林",
    },
    {
        "code": "闽",
        "province": "福建",
    },
    {
        "code": "贵",
        "province": "贵州",
    },
    {
        "code": "粤",
        "province": "广东",
    },
    {
        "code": "青",
        "province": "青海",
    },
    {
        "code": "藏",
        "province": "西藏",
    },
    {
        "code": "川",
        "province": "四川",
    },
    {
        "code": "宁",
        "province": "宁夏",
    },
    {
        "code": "琼",
        "province": "海南",
    },
    {
        "code": "台",
        "province": "台湾",
    },
    {
        "code": "港",
        "province": "香港",
    },
    {
        "code": "澳",
        "province": "澳门",
    },
  ]
}

export { json }
