import type {Effect, Reducer} from 'umi';
import type {StaffInterface} from '@/services/staff';
import {GetCurrentStaff} from '@/services/staff';
import {getPageQuery} from '@/utils/utils';
import {history} from '@@/core/history';
import {stringify} from 'querystring';
import {LSExtStaffID} from '../../config/constant';

export type StaffModelState = {
  currentStaff?: StaffInterface;
};

export type StaffModelType = {
  namespace: 'staff';
  state: StaffModelState;
  effects: {
    getCurrent: Effect;
  };
  reducers: {
    applyCurrent: Reducer<StaffModelState>;
    logout: Reducer;
  };
};

const StaffModel: StaffModelType = {
  namespace: 'staff',

  state: {},

  effects: {
    *getCurrent(_, { call, put }) {
      const response = yield call(GetCurrentStaff);
      yield put({
        type: 'applyCurrent',
        payload: response.data,
      });
    },
  },

  reducers: {
    applyCurrent(state, action) {
      const params = action.payload as StaffInterface;
      localStorage.setItem(LSExtStaffID, params.ext_staff_id);
      return {
        currentStaff: params || {},
      };
    },

    logout() {
      const { redirect } = getPageQuery();
      localStorage.removeItem(LSExtStaffID);
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/staff-frontend/login' && !redirect) {
        history.replace({
          pathname: '/staff-frontend/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }

      return {
        currentStaff: {},
      };
    },
  },
};

export default StaffModel;
