/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import React from 'react';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import type {ConnectState} from '@/models/connect';
// @ts-ignore
import ScriptTag from 'react-script-tag';
import {CommonResp, GetJSAgentConfig, GetJSAgentConfigResult, GetJSConfig, GetJSConfigResult} from "@/services/common";
import {message} from "antd";
import {ConnectProps} from "@@/plugin-dva/connect";

export type BasicLayoutProps = {
  dispatch: Dispatch;
} & ConnectProps;

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {children} = props;
  const handleScriptLoad = () => {
    // 企业级config
    GetJSConfig(window.location.href)
      .then((res: CommonResp<GetJSConfigResult>) => {
        if (res.code !== 0) {
          message.error("获取JS签名失败");
          return;
        }
        const params = res.data as GetJSConfigResult;
        // @ts-ignore
        window.wx.config({
          beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: params.app_id, // 必填，企业微信的corpID
          timestamp: params.timestamp, // 必填，生成签名的时间戳
          nonceStr: params.nonce_str, // 必填，生成签名的随机串
          signature: params.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: ["sendChatMessage", "agentConfig"] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        });

        // @ts-ignore
        window.wx.error((err: any) => {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          message.error(err);
        });

        // @ts-ignore
        window.wx.ready((result: any) => {
          console.log("wx.ready 成功", "result", result)
        });

      });

    // 应用级config
    GetJSAgentConfig(window.location.href)
      .then((res: CommonResp<GetJSAgentConfigResult>) => {
        if (res.code !== 0) {
          message.error("获取JS签名失败");
          return;
        }
        const params = res.data as GetJSAgentConfigResult;
        // @ts-ignore
        if (window.wx.agentConfig) {
          // @ts-ignore
          window.wx.agentConfig({
            corpid: params.corp_id, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid: params.agent_id, // 必填，企业微信的应用id （e.g. 1000247）
            timestamp: params.timestamp, // 必填，生成签名的时间戳
            nonceStr: params.nonce_str, // 必填，生成签名的随机串
            signature: params.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: ['sendChatMessage'], // 必填，传入需要使用的接口名称
            success(result: any) {
              console.log("agentConfig 成功", "result", result)
            },
            fail(result: any) {
              console.log("agentConfig 失败", "result", result)
              if (result.errMsg.indexOf('function not exist') > -1) {
                alert('版本过低请升级')
              }
            }
          });
        }
      });

  };

  return (
    <>
      <ScriptTag
        type="text/javascript"
        src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"
        onLoad={handleScriptLoad}
      />
      {children}
    </>
  );
};

export default connect(({settings}: ConnectState) => ({
  settings,
}))(BasicLayout);
