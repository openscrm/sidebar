import request from '@/utils/request';
import {CommonQueryParams} from "@/services/common";
import {StaffFrontendApiPrefix} from "../../../../config/constant";

export type MaterialType = "link" | "poster" | "video" | "pdf" | "ppt" | "excel" | "word";

export type QueryMaterialLibraryParams = {
  title?: string;
  material_type?: MaterialType | string;
  material_tag_list?: string[];
} & CommonQueryParams;

export interface MaterialLibraryTag {
  id: string;
  ext_corp_id: string;
  ext_creator_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
}

export interface MaterialLibraryItem {
  id: string;
  ext_corp_id: string;
  ext_creator_id: string;
  material_type: MaterialType;
  title: string;
  file_size: string;
  url: string;
  link: string;
  digest: string;
  material_tag_list: any[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
  tags?: MaterialLibraryTag[];
}

// 查询话术分组
export async function QueryMaterialLibrary(params?: QueryMaterialLibraryParams) {
  return request(`${StaffFrontendApiPrefix}/material/lib`, {
    method: 'GET',
    params
  });
}


export type QueryMaterialLibraryTagParams = {
  title?: string;
  material_type?: MaterialType | string;
  material_tag_list?: string[];
} & CommonQueryParams;

// 查询话术分组
export async function QueryMaterialLibraryTag(params?: QueryMaterialLibraryTagParams) {
  return request(`${StaffFrontendApiPrefix}/material/lib/tags`, {
    method: 'GET',
    params
  });
}
