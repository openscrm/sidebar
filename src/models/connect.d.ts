import type {MenuDataItem, Settings as ProSettings} from '@ant-design/pro-layout';
import {GlobalModelState} from './global';
import type {StateType} from './login';
import type {StaffModelState} from '@/models/staff';

export { GlobalModelState, UserModelState };

export type Loading = {
  global: boolean;
  effects: Record<string, boolean | undefined>;
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    staff?: boolean;
  };
};

export type ConnectState = {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  staff: StaffModelState;
  login: StateType;
};

export type Route = {
  routes?: Route[];
} & MenuDataItem;
