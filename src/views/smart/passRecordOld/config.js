/*
 * @Author: Stephen
 * @Date: 2019-11-14 18:45:49
 * @LastEditors: Stephen
 * @LastEditTime: 2019-11-18 18:41:17
 */
const json = {
  menuFullParams: [{
    icon: '&#xe6b6;',
    label: 'face',
    index: '1',
    type: 'pass'
  }, {
    icon: '&#xec5a;',
    label: 'pedestrian',
    index: '2',
    type: 'pass'
  }, {
    icon: '&#xe622;',
    label: 'vehicle',
    index: '3',
    type: 'pass'
  }, {
    icon: '&#xe6f6;',
    label: 'nonmotor',
    index: '4',
    type: 'pass'
  }],
  menuFullParams1: [{
    icon: '&#xe622;',
    label: 'vehicle',
    index: '1',
    type: 'pass'
  }, {
    icon: '&#xe6f6;',
    label: 'nonmotor',
    index: '2',
    type: 'pass'
  }],
  menuFaceParams: [{
    icon: '&#xe6b6;',
    label: 'face',
    index: '1',
    type: 'pass'
  }],
  filter: {
    time: {
      label: 'time',
      type: 'input',
      span: 5,
      offset: 0,
      params: [{
          name: 'all'
        },
        {
          name: 'today'
        },
        {
          name: 'three'
        },
        {
          name: 'seven'
        },
        {
          name: 'auto'
        }
      ]
    },
    camera: {
      label: 'camera',
      type: 'select',
      span: 5,
      offset: 2,
    },
    sex: {
      label: 'sex',
      type: 'input',
      span: 5,
      offset: 2,
      params: [{
          name: 'all'
        },
        {
          name: 'male'
        },
        {
          name: 'female'
        },
        {
          name: 'unknown'
        }
      ]
    },
    clearBtn: {
      type: 'button',
      span: 2,
      offset: 2,
    },
    mask: {
      label: 'mask',
      type: 'input',
      span: 5,
      offset: 0,
      params: [{
          name: 'all'
        },
        {
          name: 'have'
        },
        {
          name: 'none'
        },
        {
          name: 'unknown'
        }
      ]
    },
    sunglass: {
      label: 'sunglass',
      type: 'input',
      span: 5,
      offset: 2,
      params: [{
          name: 'all'
        },
        {
          name: 'have'
        }, {
          name: 'none'
        }, {
          name: 'unknown'
        }
      ]
    },
    glass: {
      label: 'glass',
      type: 'input',
      span: 5,
      offset: 2,
      params: [{
          name: 'all'
        },
        {
          name: 'have'
        }, {
          name: 'none'
        }, {
          name: 'unknown'
        }
      ]
    },
    hat: {
      label: 'hat',
      type: 'input',
      span: 5,
      offset: 2,
      params: [{
          name: 'all'
        },
        {
          name: 'have'
        }, {
          name: 'none'
        }, {
          name: 'hasScarf'
        }
      ]
    }
  }
}

export default json
