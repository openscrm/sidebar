import request from "@/utils/request";
import {StaffFrontendApiPrefix} from "../../config/constant";

export interface StaffFrontendLoginParams {
  ext_corp_id?: string;
  source_url: string;
}

export interface StaffFrontendLoginResult {
  app_id: string;
  redirect_uri: string;
  source_url: string;
  state: string;
  location_url: string;
}

export async function StaffFrontendLogin(params: StaffFrontendLoginParams) {
  return request(`${StaffFrontendApiPrefix}/action/login`, {
    method: 'POST',
    data: {...params},
  });
}
