<p style="text-align: center">
  <img alt="logo" height="48" src="https://openscrm.oss-cn-hangzhou.aliyuncs.com/public/openscrm_logo.svg">
</p>

<h3 style="text-align: center">
安全，强大，易开发的企业微信SCRM
</h3>

[安装](#如何安装) |
[截图](#项目截图) 

### 项目简介

> 此项目为OpenSCRM **侧边栏** 前端项目

### 如何安装
- 修改config/proxy.ts，将后端接口地址修改为你的后端服务地址，如：http://127.0.0.1:8080/
```shell
  dev: { #开发环境
    '/api/': {
      target: 'http://127.0.0.1:8080/', # 后端接口地址
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
```

- 安装tyarn，安装tyarn是淘宝加速过的yarn
```shell
npm -g install tyarn
```

- 安装项目依赖
```shell
tyarn install
```

- 启动开发环境
```shell
tyarn start
```

此前端项目是基于Antd Pro的，备查文档：https://pro.ant.design/zh-CN/docs/overview

### 项目截图
<img src="https://openscrm.oss-cn-hangzhou.aliyuncs.com/public/screenshots/%E4%BE%A7%E8%BE%B9%E6%A0%8F-%E8%AF%9D%E6%9C%AF%E5%BA%93.png" width="300" />
<br />
<img src="https://openscrm.oss-cn-hangzhou.aliyuncs.com/public/screenshots/%E4%BE%A7%E8%BE%B9%E6%A0%8F-%E7%B4%A0%E6%9D%90%E7%AE%A1%E7%90%86.png" width="300" />

### 技术栈
* [React](https://zh-hans.reactjs.org/)
* [TypeScript](https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html)
* [Ant Design](https://ant.design/components/overview-cn/)
* [Ant Design Pro](https://pro.ant.design/zh-CN/docs/overview)
* [Pro Components](https://procomponents.ant.design/components)

### 联系作者

<img src="https://openscrm.oss-cn-hangzhou.aliyuncs.com/public/screenshots/qrcode.png" width="200" />

扫码可加入交流群

### 版权声明

OpenSCRM遵循Apache2.0协议，可免费商用
