import {parse} from 'querystring';
import {message} from 'antd/es';
import type {SortOrder} from 'antd/lib/table/interface';
import type React from 'react'
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

/** 判断是否是图片链接 */
export const isImg = (path: string): boolean => /\w.(png|jpg|jpeg|svg|webp|gif|bmp)$/i.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// For the official demo site, it is used to turn off features that are not needed in the real development environment
export const isAntDesignProOrDev = (): boolean => {
  const {NODE_ENV} = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getCurrentHost = () => `${window.location.protocol}//${window.location.host}`;

// HandleRequest 简易的请求处理函数
export const HandleRequest = async (
  values: any,
  requestFn: (arg: any) => any,
  succeededCallbackFn?: () => void,
  failedCallbackFn?: () => void,
) => {
  const hide = message.loading('处理中');
  const resp = await requestFn({...values});
  hide();
  if (resp && resp?.code === 0) {
    message.success('处理成功');
    if (succeededCallbackFn) {
      succeededCallbackFn();
    }
    return true;
  }

  if (resp && resp?.message) {
    message.error(resp?.message);
    if (failedCallbackFn) {
      failedCallbackFn();
    }
    return false;
  }

  message.error('处理失败');
  return false;
};

export const FormatQueryParams = (params: any) => {
  const newParams = {...params};
  if (newParams) {
    delete newParams.current;
    delete newParams.pageSize;
  }
  return newParams;
};

const formatAvatarURL = (url: string, size: number) => {
  const params = url.split('/');
  params.pop();
  params.push(size.toString());
  return params.join('/');
};

export const FormatWechatAvatar = (url: string, size: 0 | 46 | 64 | 96 | 132) => {
  return formatAvatarURL(url, size);
};

export const FormatWeWorkAvatar = (url: string, size: 0 | 40 | 60) => {
  return formatAvatarURL(url, size);
};

// ProTableRequestAdapter ProTable请求适配
export const ProTableRequestAdapter = async (
  params: any & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  },
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[] | null>,
  requestFn: (arg: any) => any,
  refreshFingerFn?: (arg: any) => void,
): Promise<any> => {
  // console.log('sort', sort);
  // console.log('filter', filter);
  // console.log('params', params);

  const formattedParams = FormatQueryParams({
    ...params,
    page: params.current,
    page_size: params.pageSize,
  });

  if (sort && Object.keys(sort)) {
    Object.keys(sort).forEach((key) => {
      formattedParams.sort_field = key;
      formattedParams.sort_type = sort[key] === 'ascend' ? 'asc' : 'desc';
    });
  }

  if (formattedParams.created_at) {
    [formattedParams.created_at_start, formattedParams.created_at_end] = formattedParams.created_at;
    delete formattedParams.created_at;
  }

  const resp = await requestFn(formattedParams);
  if (refreshFingerFn) {
    refreshFingerFn(Date.now());
  }
  return {
    data: resp.data.items || [],
    success: resp.code === 0,
    total: resp.data.pager.total_rows || 0,
  };
};

export const ToBoolNumber = (data: boolean): number => {
  return data ? 1 : 2;
};

// IsWxWorkBrowser 检测浏览器是否为企业微信内置浏览器
export const IsWxWorkBrowser = (): boolean => {
  return window.navigator.userAgent.includes('wxwork')
};

/**
 * 数据类型检测，String，Number，Array...
 */
 export class PrototypeCheck {
  static getPrototype(value: any): string {
    return Object.prototype.toString.call(value);
  }

  static checkProtoType(value: any, prototype: string): boolean {
    return this.getPrototype(value) === prototype;
  }

  /**
   * 是否String类型
   * @param value
   */
  static isString(value: any): boolean {
    return this.checkProtoType(value, '[object String]');
  }

  /**
   * 是否Number类型
   * @param value
   */
  static isNumber(value: any): boolean {
    return this.checkProtoType(value, '[object Number]');
  }

  /**
   * 是否Array类型
   * @param value
   */
  static isArray(value: any): boolean {
    return this.checkProtoType(value, '[object Array]');
  }

  /**
   * 是否Function类型
   * @param value
   */
  static isFunction(value: any): boolean {
    return this.checkProtoType(value, '[object Function]');
  }
}

// humanFileSize 易读的文件大小
export const humanFileSize = (input: number | string) => {
  const size = parseInt(input.toString(),10);
  if (size === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  // eslint-disable-next-line no-restricted-properties
  return `${(size / Math.pow(k, i)).toPrecision(3)} ${sizes[i]}`;
}
