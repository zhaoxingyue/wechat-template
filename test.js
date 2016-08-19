import ava from 'ava'

const send = require('./index')
const moment = require('moment')

let redis_conf = {
  host: 'localhost', 
  port: 6379, 
  password: ''
}

let wechat_param = {
  appid : 'your_appid', 
  appsecret : 'your_appsecret',
  touser : 'your_touser',
  template_id : 'yuor_template_id',
  url : '',
  data : {
    first : {
      value :'标题'
    },
    performance : {
      value : '表现'
    },
    time : {
      value : moment().format('YYYY年MM月DD日 HH时mm分')
    },
    remark : {
      value : '备注'
    }
  }
}

ava('test send wechat_template', t => {
  return send(redis_conf, wechat_param)
  .then(body => {
    console.log(body)
    t.is(body.errcode, 0)
    t.is(body.errmsg, 'ok')
  })
  .catch(err => {
    t.fail()
  })
})
