import request from "@/utils/request";
import {StaffFrontendApiPrefix} from "../../config/constant";

export interface StaffInterface {
  id: string;
  ext_corp_id: string;
  ext_staff_id: string;
  role_id: string;
  type: string;
  name: string;
  address: string;
  alias: string;
  avatar_url: string;
  email: string;
  gender: number;
  status: number;
  mobile: string;
  qr_code_url: string;
  telephone: string;
  is_enabled: boolean;
  signature: string;
  external_position: string;
  external_profile: string;
  extattr: string;
  external_user_count: number;
  corp_id: string;
  dept_ids: number[];
  order?: any;
  is_leader_in_dept?: any;
  welcome_msg_id: string;
}

// GetCurrentStaff 获取当前登录员工
export async function GetCurrentStaff() {
  return request(`${StaffFrontendApiPrefix}/action/get-current-staff`, {
    method: 'GET',
  });
}
