
const json = {
    formParams: [
      { label: 'deviceName' },
    ],
    deviceRules: {
      deviceName: [
        {required: true, message: '请输入设备名称', trigger: 'blur'},
      ],
    }
  }
  
  export default json
  