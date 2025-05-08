// 导入axios库，用于发起HTTP请求
import axios from "axios";
// 导入axios的类型定义，用于TypeScript类型检查
import type {
  AxiosResponse, // axios响应对象的类型
  AxiosInstance, // axios实例的类型
  InternalAxiosRequestConfig, // axios内部请求配置的类型
  AxiosRequestConfig, // axios请求配置的类型
} from "axios";
// 导入自定义类型定义
import type {
  RequestInterceptors, // 请求拦截器的类型
  CreateRequestConfig, // 创建请求配置的类型
  ServerResult, // 服务器响应结果的类型
} from "./types";

// 定义AxiosRequest类，用于创建和管理axios实例
class AxiosRequest {
  // axios实例
  instance: AxiosInstance;
  // 拦截器对象，可选
  interceptorsObj?: RequestInterceptors<AxiosResponse>;
  // 存放取消请求控制器的Map，用于管理请求的取消操作。
  abortControllerMap: Map<string, AbortController>;

  // 构造函数，接收创建请求的配置
  constructor(config: CreateRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(config);
    // 初始化存放取消请求控制器的Map
    this.abortControllerMap = new Map();
    // 保存拦截器对象
    this.interceptorsObj = config.interceptors;

    // 拦截器执行顺序 接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应
    // 添加全局请求拦截器
    this.instance.interceptors.request.use(
      (res: InternalAxiosRequestConfig) => {
        // 创建一个新的AbortController用于取消请求
        const controller = new AbortController();
        // 初始化url变量，用于存储请求的唯一标识
        let url = res.method || "";
        // 设置请求的signal属性，用于取消请求
        res.signal = controller.signal;

        // 如果存在url，将其添加到标识中
        if (res.url) url += `^${res.url}`;

        // 如果存在参数，将参数添加到标识中
        if (res.params) {
          for (const key in res.params) {
            url += `&${key}=${res.params[key]}`;
          }
        }

        // 如果存在post数据且是JSON格式，将数据添加到标识中
        if (
          res.data &&
          res.data?.[0] === "{" &&
          res.data?.[res.data?.length - 1] === "}"
        ) {
          // 尝试解析JSON数据
          const obj = JSON.parse(res.data);
          // 将JSON数据的每个键值对添加到标识中
          for (const key in obj) {
            url += `#${key}=${obj[key]}`;
          }
        }

        // 如果存在相同标识的请求，则取消之前的请求
        if (this.abortControllerMap.get(url)) {
          // 在控制台输出警告信息
          console.warn("取消重复请求：", url);
          // 取消之前的请求
          this.cancelRequest(url);
        } else {
          // 将新的控制器添加到Map中
          this.abortControllerMap.set(url, controller);
        }

        // 返回处理后的请求配置
        return res;
      },
      // 请求错误处理函数
      (err: object) => err
    );

    // 使用实例拦截器
    // 添加请求拦截器
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch
    );
    // 添加响应拦截器
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch
    );

    // 全局响应拦截器保证最后执行
    this.instance.interceptors.response.use(
      // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
      (res: AxiosResponse) => {
        // 获取请求的url
        const url = res.config.url || "";
        // 从Map中删除已完成的请求
        this.abortControllerMap.delete(url);
        // 返回响应数据
        return res.data;
      },
      // 响应错误处理函数
      (err: object) => err
    );
  }
  /**
   * 取消全部请求
   */
  cancelAllRequest() {
    // 遍历Map中的所有控制器
    for (const [, controller] of this.abortControllerMap) {
      // 取消请求
      controller.abort();
    }
    // 清空Map
    this.abortControllerMap.clear();
  }
  /**
   * 取消指定的请求
   * @param url - 待取消的请求URL
   */
  cancelRequest(url: string | string[]) {
    // 将url转换为数组
    const urlList = Array.isArray(url) ? url : [url];
    // 遍历url数组
    for (const _url of urlList) {
      // 取消请求
      this.abortControllerMap.get(_url)?.abort();
      // 从Map中删除请求
      this.abortControllerMap.delete(_url);
    }
  }
  /**
   * get请求
   * @param url - 链接
   * @param options - 参数
   */
  get<T = object>(url: string, options = {}) {
    // 调用axios实例的get方法发起请求
    return this.instance.get(url, options) as Promise<ServerResult<T>>;
  }
  /**
   * post请求
   * @param url - 链接
   * @param options - 参数
   * @param config - 配置
   */
  post<T = object>(
    url: string,
    options = {},
    config?: AxiosRequestConfig<object>
  ) {
    // 调用axios实例的post方法发起请求
    return this.instance.post(url, options, config) as Promise<ServerResult<T>>;
  }
  /**
   * put请求
   * @param url - 链接
   * @param options - 参数
   * @param config - 配置
   */
  put<T = object>(
    url: string,
    options = {},
    config?: AxiosRequestConfig<object>
  ) {
    // 调用axios实例的put方法发起请求
    return this.instance.put(url, options, config) as Promise<ServerResult<T>>;
  }
  /**
   * delete请求
   * @param url - 链接
   * @param options - 参数
   */
  delete<T = object>(url: string, options = {}) {
    // 调用axios实例的delete方法发起请求
    return this.instance.delete(url, options) as Promise<ServerResult<T>>;
  }
}

// 导出AxiosRequest类
export default AxiosRequest;
