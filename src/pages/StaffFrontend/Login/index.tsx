import React, {useEffect} from 'react';
import {connect} from 'umi';
import {StaffFrontendLogin, StaffFrontendLoginResult} from "@/services/login";
import {CommonResp} from "@/services/common";
import {message} from "antd";
import {LSExtCorpID, StaffFrontendApiPrefix} from "../../../../config/constant";
import {IsWxWorkBrowser} from "@/utils/utils";
import request from "@/utils/request";
import {StaffInterface} from "@/services/staff";

const Login: React.FC = () => {
  const sourceURL = new URLSearchParams(window.location.search).get('redirect') || window.location.href.replace(window.location.pathname, '/staff-frontend/login-callback')
  useEffect(() => {
    if (IsWxWorkBrowser()) {
      // 企业微信浏览器环境
      StaffFrontendLogin({source_url: sourceURL}).then((res: CommonResp<StaffFrontendLoginResult>) => {
        if (res.code !== 0) {
          message.error('获取登录参数失败，请联系管理员')
          return
        }

        localStorage.setItem(LSExtCorpID, res.data.app_id);
        window.location.href = res.data.location_url;
      })
    } else {
      // 非企业微信浏览器环境
      if (process.env.NODE_ENV !== 'development') {
        console.log('并非开发环境，不做调试');
        return
      }

      console.log('非企业微信浏览器，进入调试模式');
      console.log('自动使用调试接口尝试登录');
      request(`${StaffFrontendApiPrefix}/action/force-login`, {
        method: 'POST',
        data: {
          ext_staff_id: 'admin'
        },
      }).then((res: CommonResp<StaffInterface>) => {
        if (res.code !== 0) {
          message.error('尝试登录失败');
          return;
        }

        window.location.href = sourceURL;

      });

    }
  }, []);
  return <></>;
};

export default connect(() => ({}))(Login);
