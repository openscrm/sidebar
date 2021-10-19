import React, {useEffect} from 'react';
import {connect} from 'umi';
import type {Dispatch} from '@@/plugin-dva/connect';

export type LoginCallbackProps = {
  dispatch: Dispatch;
};

const LoginCallback: React.FC<LoginCallbackProps> = (props) => {
  const sourceURL = new URLSearchParams(window.location.search).get('redirect') || window.location.href.replace(window.location.pathname, '/staff-frontend/welcome')
  useEffect(() => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'staff/getCurrent',
      });
    }
  }, [props]);

  window.location.href = sourceURL;

  return <></>
};

export default connect(() => ({}))(LoginCallback);
