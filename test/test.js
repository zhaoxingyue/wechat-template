'use strict'

const ava = require('ava')
const moment = require('moment')
const wechat_template = require('../index')

ava('test send wechat_template', t => {
  let redis_conf = {
    host: 'localhost', 
    port: 6379, 
    password: ''
  }
  let wechat_param = {
    appid : 'your_appid', 
    appsecret : 'your_appsecret',
    touser : 'your_touser',
    template_id : 'your_template_id',
    url : '通知点击详情页',
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

  return wechat_template(redis_conf, wechat_param)
  .then(body => {
    t.is(body.errcode, 0)
    t.is(body.errmsg, 'ok')
  })
  .catch(err => {
    t.fail()
  })
})
