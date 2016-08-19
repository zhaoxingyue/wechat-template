import ava from 'ava'

const send = require('./index')

let redis = {
  host : 'localhost',
  port : 6379,
  password : ''
}

let wechat = {
  appid : 'wx04014b02a0a61c90',
  appsecret : 'cc4c224b5018370cf6ffc95ad2be309c',
  template_id : 'QEgD6JBsMPX0gOur1luNo0_w5egmsoZzQ1fMbaZKYwI',
  data : {
    first : {
      value : '测试！',
      color : '#173177'
    },
    performance : {
      value : '测试推送模板消息'
    },
    time : {
      value : '2016-08-05'
    },
    remark : {
      value : '测试remark'
    }
  },
  touser : 'o12hcuM51yGHPgBPTgLlE7BAYCWA'
}

ava('test send wechat_template', t => {
  send(redis, wechat)
  .then(result => {
    console.log(result)
  })
})