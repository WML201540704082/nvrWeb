import { validateIP,validateGateway, validateDNS } from '@/utils/validate.js'

const json = {
  formParams: [
    { label: 'dev', name: 'dev' },
    { label: 'ip', name: 'ip' },
    { label: 'netmask', name: '子网掩码' },
    { label: 'gateway', name: '网关' },
    { label: 'dns', name: 'DNS' }
  ],
  netRules: {
    ip: [
      {required: true, message: '请输入IP', trigger: 'blur'},
      {validator: validateIP, message: '请输入正确的格式!', trigger: 'blur' }
    ],
    netmask: [
      {required: true, message: '请输入子网掩码', trigger: 'blur'},
      {validator: validateIP, message: '请输入正确的格式!', trigger: 'blur' }
    ],
    gateway: [
      {required: false, message: '请输入网关', trigger: 'blur'},
      {validator: validateGateway, message: '请输入正确的格式!', trigger: 'blur' }
    ],
    dns: [
      {required: true, message: '请输入DNS', trigger: 'blur'},
      {validator: validateDNS, message: '请输入正确的格式!', trigger: 'blur' }
    ],
    dev: [
      {required: true, message: '请选择dev', trigger: 'blur'}
    ]
  }
}

export default json
