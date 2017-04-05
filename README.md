[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)]()
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/wechat-template)

# wechat-template
基于微信模板通知和redis缓存的简单封装消息推送模块

## Features

- 将微信的 access_token 进行定时存储
- 简化微信模板推送参数及流程

## Installation

```
$ npm install wechat-template
$ npm install wechat-template --save
```

## Usage

Create a new scheduler instance
```
const wechat_template = require('wechat-template')
```
### options 

- options 第一个参数为redis配置
    - redis地址，默认为localhost (String)
    - redis端口, 默认为6379 (Number)
    - redis密码, 默认为''(String)

格式如下 ：
```
  let redis_conf = {
    host: 'localhost', 
    port: 6379, 
    password: ''
  }
```

- options 第二个参数为模板消息数据  
    - appid 微信的appid，需到公众平台获取
    - appsecret 需到公众平台获取
    - touser 接收消息用户的openid
    - template_id 模板消息id，需到公众平台获取
    - url 模板打开后的详情页面url
    - data 消息详情 (根据不同的模板有不同的参数)，详情见[微信推送模板文档](https://mp.weixin.qq.com/wiki/17/304c1885ea66dbedf7dc170d84999a9d.html)  

格式如下 ：
```
  let wechat_param = {
    appid : 'your_appid', 
    appsecret : 'your_appsecret',
    touser : 'your_touser',
    template_id : 'your_template_id',
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
```

### send wechat_template

```
const wechat_template = require('wechat-template')

wechat_template(redis_conf, wechat_param)
.then(function (body) {
  console.log(body)
  // { errcode: 0, errmsg: 'ok', msgid: 413823689 }
}) 
```

## Testing

克隆该项目到本地，将test.js中的参数替换为正确参数。运行如下命令：

```
$ npm install
$ npm test
```









