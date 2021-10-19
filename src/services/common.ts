import request from "@/utils/request";
import {StaffFrontendApiPrefix} from "../../config/constant";

export interface CommonResp<T> {
  code: number;
  message: string;
  data: T;
}

export interface CommonItemsResp<T> {
  code: number;
  message: string;
  data: {
    items: T[],
    total: number,
  };
}

export type Pager = {
  total_rows?: number;
  page_size?: number;
  page?: number;
};

export type Sorter = {
  sort_field?: string;
  sort_type?: string;
};

export type CommonQueryParams = {
  sort_field?: 'id' | 'created_at' | 'updated_at' | 'sort_weight';
  sort_type?: 'asc' | 'desc';

  page_size?: number;
  page?: number;
};

export interface ParseURLResult {
  title: string;
  desc: string;
  img_url: string;
  link_url: string;
}

// ParseURL 解析URL
export async function ParseURL(url: string) {
  return request(`${StaffFrontendApiPrefix}/common/action/parse-link`, {
    method: 'POST',
    data: {url}
  });
}

export interface GetSignedURLResult {
  upload_url: string;
  download_url: string;
}

// GetSignedURL 获取云存储上传地址
export async function GetSignedURL(filename: string) {
  return request(`${StaffFrontendApiPrefix}/common/action/get-signed-url`, {
    method: 'POST',
    data: {file_name: filename},
  });
}

export interface GetJSConfigResult {
  timestamp: number;
  signature: string;
  nonce_str: string;
  app_id: string;
}

// GetJSConfig 获取JS企业级config所需参数
export async function GetJSConfig(url: string) {
  return request(`${StaffFrontendApiPrefix}/action/get-js-config`, {
    method: 'POST',
    data: {url},
  });
}


export interface GetJSAgentConfigResult {
  corp_id: string;
  agent_id: number;
  timestamp: number;
  nonce_str: string;
  signature: string;
  url: string;
}

// GetJSAgentConfig 获取JS应用级agent config所需参数
export async function GetJSAgentConfig(url: string) {
  return request(`${StaffFrontendApiPrefix}/action/get-js-agent-config`, {
    method: 'POST',
    data: {url},
  });
}

export type MediaType = 'image' | 'voice' | 'video' | 'file';

export interface UploadMediaResult {
  type: MediaType;
  media_id: string;
  created_at: Date;
}

// UploadMedia 上传临时素材
export async function UploadMedia(type: MediaType, url: string) {
  return request(`${StaffFrontendApiPrefix}/action/upload-media`, {
    method: 'POST',
    data: {type, url},
  });
}
