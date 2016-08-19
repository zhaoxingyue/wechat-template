'use strict'

const rp = require('request-promise')
const Promise = require('bluebird')
const Redis = require('ioredis')
const Scheduler = require('redis-scheduler')

module.exports = function (redis_conf, wechat_param) {
  const scheduler = new Scheduler({
    host: redis_conf.host || 'localhost', 
    port: redis_conf.port || 6379, 
    password: redis_conf.password || ''
  })
  const redis = new Redis(redis_conf.port, redis_conf.host, {password: redis_conf.password});
  Promise.promisifyAll(redis.get)
  Promise.promisifyAll(redis.set)

  let url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential' + 
            '&appid=' + wechat_param.appid + 
            '&secret=' + wechat_param.appsecret
  let _key = 'access_token'
  /**
    *  1. 获取到access_token后调用微信接口推送模板
    *  2. 判断返回值，如果返回40001说明access_token失效
    *  3. 销毁redis中access_token，重新获取存储
    */
  let send_message = access_token => {
    let send_url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + access_token;
    let data = {
      touser : wechat_param.touser,
      template_id : wechat_param.template_id,
      url : wechat_param.url,
      data : wechat_param.data
    }
    let option = {
      method: 'POST',
      uri: send_url,
      body: data,
      json: true
    }
    return rp(option)
    .then(body => {
      if (body.errcode === 40001) {
        redis.del(_key)
        rp(url)
        .then(v => {
          let token = JSON.parse(v).access_token
          send_message(token)
        })
      }else {
        return Promise.resolve(body)
      } 
    })
  }
  /**
    *  1. 先查询redis中是否存在access_token，存在直接调用send_message
    *  2. 不存在则获取，存在scheduler中，定时7000秒（access_token有效期为7200秒）
    *  3. 过期销毁redis中的键值
    */
  return redis.get(_key)
  .then(value => {
    if (value) {
      return send_message(value)
    }else {
      return rp(url)
      .then(body => {
        let token = JSON.parse(body).access_token
        return send_message(token)
        redis.set(_key, token)
        scheduler.schedule({
          key : _key,
          expire : 1000 * 7000,
          handler : (err, key) => {
            redis.del(_key)
          }
        })
      })
    }
  })  
}
