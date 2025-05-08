// 导入TOKEN常量，用于存储和获取认证令牌
import { TOKEN } from "@/utils/config";
// 导入请求创建函数，这是一个自定义的请求工具，来自@south/request包
import { creteRequest } from "@south/request";

// 获取环境变量中定义的API基础URL
// import.meta.env.VITE_BASE_URL 是Vite提供的环境变量访问方式，as string 用于类型断言，确保获取到的是字符串类型
const prefixUrl = import.meta.env.VITE_BASE_URL as string;

// 根据当前环境确定使用的baseURL
// 在开发环境(development)中使用'/api'作为代理前缀
// 在生产环境中使用从环境变量获取的prefixUrl
const baseURL = process.env.NODE_ENV !== "development" ? prefixUrl : "/api";

// 使用creteRequest函数创建一个请求实例
// 参数1: baseURL - API的基础URL
// 参数2: TOKEN - 用于存储和获取认证令牌的键名
export const request = creteRequest(baseURL, TOKEN);

// 创建多个请求实例的示例代码(已注释)
// 可以创建指向不同API端点的请求实例
// export const newRequest = creteRequest('/test', TOKEN);

/**
 * 取消请求函数
 * @param url - 需要取消的请求URL，可以是单个字符串或字符串数组
 * @returns 返回request实例的cancelRequest方法执行结果
 */
export const cancelRequest = (url: string | string[]) => {
  return request.cancelRequest(url);
};

/**
 * 取消所有请求函数
 * @returns 返回request实例的cancelAllRequest方法执行结果
 */
export const cancelAllRequest = () => {
  return request.cancelAllRequest();
};
