import React from 'react';
import {PageLoading} from '@ant-design/pro-layout';
import type {ConnectProps} from 'umi';
import {connect, Redirect} from 'umi';
import {stringify} from 'querystring';
import type {ConnectState} from '@/models/connect';
import type {StaffInterface} from '@/services/staff';
import {LSExtStaffID} from '../../config/constant';

type SecurityLayoutProps = {
  loading?: boolean;
  currentStaff?: StaffInterface;
} & ConnectProps;

type SecurityLayoutState = {
  isReady: boolean;
};

class StaffFrontendSecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const {dispatch} = this.props;
    if (dispatch) {
      // dispatch({
      //   type: 'adminType/changeStatus',
      //   payload: 'staffAdmin',
      // });
      dispatch({
        type: 'staff/getCurrent',
      });
    }
  }

  render() {
    const {isReady} = this.state;
    const {children, loading} = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // You can replace it with your own login authentication rules (such as judging whether the token exists)
    const isLogin = localStorage.getItem(LSExtStaffID) !== null;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading/>;
    }

    if (!isLogin && window.location.pathname !== '/staff-frontend/login') {
      return <Redirect to={`/staff-frontend/login?${queryString}`}/>;
    }
    return children;
  }
}

export default connect(({staff, loading}: ConnectState) => ({
  currentStaff: staff.currentStaff,
  loading: loading.models.staff,
}))(StaffFrontendSecurityLayout);
