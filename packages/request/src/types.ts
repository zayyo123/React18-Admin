// 导入axios的类型定义，用于扩展和复用
import type {
  AxiosResponse, // axios响应对象的类型
  InternalAxiosRequestConfig, // axios内部请求配置的类型
  CreateAxiosDefaults, // 创建axios实例的默认配置类型
  Cancel, // axios取消请求的类型
} from "axios";

/**
 * 扩展的请求取消接口，继承自axios的Cancel接口
 * 添加了额外的数据和响应信息
 */
export interface RequestCancel extends Cancel {
  data: object; // 请求取消时的数据
  response: {
    // 请求取消时的响应信息
    status: number; // HTTP状态码
    data: {
      // 响应数据
      code?: number; // 业务状态码
      message?: string; // 业务消息
    };
  };
}

/**
 * 请求拦截器接口，定义了请求和响应的拦截器函数
 * 泛型T用于指定响应数据的类型
 */
export interface RequestInterceptors<T> {
  // 请求拦截器：在请求发送前处理请求配置
  requestInterceptors?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig;
  // 请求错误拦截器：处理请求发送前的错误
  requestInterceptorsCatch?: (err: RequestCancel) => void;
  // 响应拦截器：处理服务器返回的响应
  responseInterceptors?: (config: T) => T;
  // 响应错误拦截器：处理服务器返回的错误
  responseInterceptorsCatch?: (err: RequestCancel) => void;
}

/**
 * 创建请求配置接口，扩展自axios的CreateAxiosDefaults接口
 * 添加了自定义的拦截器配置
 * 泛型T用于指定响应数据的类型，默认为AxiosResponse
 */
export interface CreateRequestConfig<T = AxiosResponse>
  extends CreateAxiosDefaults {
  interceptors?: RequestInterceptors<T>; // 拦截器配置
}

/**
 * 服务器响应结果接口，定义了标准的API响应格式
 * 泛型T用于指定业务数据的类型，默认为unknown
 */
export interface ServerResult<T = unknown> {
  code: number; // 业务状态码
  message?: string; // 业务消息，可选
  data: T; // 业务数据，类型由泛型T指定
}
