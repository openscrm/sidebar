import request from '@/utils/request';
import {CommonQueryParams} from "@/services/common";
import {StaffFrontendApiPrefix} from "../../../../config/constant";


export type SearchScriptLibraryGroupParams = {
  keyword: string;
} & CommonQueryParams;


export interface Image {
  title: string;
  size: string;
  picurl: string;
  media_id: string;
}

export interface Link {
  title: string;
  url: string;
  picurl: string;
  desc: string;
}

export interface Video {
  title: string;
  size: string;
  picurl: string;
  media_id: string;
}

export interface Pdf {
  title: string;
  size: string;
  fileurl: string;
  media_id: string;
}

export interface Text {
  content: string;
}

export type MsgType = 'text'| 'image' | 'link' | 'video' | 'pdf';

export interface QuickReplyContent {
  msg_type: MsgType;
  image: Image;
  link: Link;
  video: Video;
  pdf: Pdf;
  text: Text;
}


export interface ReplyDetail {
  id: string;
  ext_corp_id: string;
  ext_creator_id: string;
  quick_reply_id: string;
  quick_reply_content: QuickReplyContent;
  scope: string;
  content_type: number;
  send_count: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
}

export interface QuickReply {
  id: string;
  ext_creator_id: string;
  ext_corp_id: string;
  name: string;
  quick_reply_type: number;
  searchable_text: string[];
  send_count: number;
  staff_ext_id: string;
  staff_name: string;
  scope: string;
  reply_details: ReplyDetail[];
  group_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
}

export interface ScriptLibraryGroupItem {
  id: string;
  ext_corp_id: string;
  ext_creator_id: string;
  name: string;
  parent_id: string;
  departments: number[];
  is_top_group: number;
  sub_group?: any;
  quick_replies?: QuickReply[];
  order: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
}

// 查询话术分组
export async function SearchScriptLibraryGroup(params?: SearchScriptLibraryGroupParams) {
  return request(`${StaffFrontendApiPrefix}/quick-reply-group/action/search`, {
    method: 'POST',
    params
  });
}
