import { request } from 'umi';

export interface requestPorps {
  c: string;
  m?: string;
  item?: any;
}
const reqKeys = new Map();

/** 获取初始化数据 */
export async function init(params: { c: string; s: string }) {
  try {
    return await request(`/api/${params.c}/view/${params.s}`, {
      method: 'POST',
    });
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
}
export async function search(params: { c: string; s: string; item: any }) {
  try {
    if (!reqKeys.has(params.c)) {
      console.log(params.c);
      reqKeys.set(params.c, params.item);
      return await request(`/api/${params.c}/search/${params.s}`, {
        method: 'POST',
        data: params.item,
      });
    } else {
      console.log(params.c + '查询中，不能重复请求！');
      return {
        success: false,
        message: '查询中，不能重复请求！',
      };
    }
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  } finally {
    reqKeys.delete(params.c);
  }
}
export async function execute(params: { c: string; m: string; s: string; item: any }) {
  const key = params.c + '-' + params.m;
  try {
    if (!reqKeys.has(key)) {
      reqKeys.set(key, params.item);
      return await request(`/api/${params.c}/${params.m}/${params.s}`, {
        method: 'POST',
        data: params.item,
      });
    } else {
      console.log(key + '执行中，不能重复请求！');
      return {
        success: false,
        message: '执行中，不能重复请求！',
      };
    }
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  } finally {
    reqKeys.delete(key);
  }
}

export async function getMenu(service:string) {
  try {
    return await request(`/api/servermanage/getmenu/${service}`, {
      method: 'POST',
    });
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
}
export async function getRouters(path: string) {
  try {
    return await request(path, {
      method: 'POST',
    });
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
}
export async function getService() {
  try {
    return await request(`/api/servermanage/queryservice`, {
      method: 'POST',
    });
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
}
