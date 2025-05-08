// 导入消息提示组件，用于显示请求相关的提示信息
import { message } from "@south/message";
// 导入本地存储工具函数，用于获取和移除本地存储的信息（如token）
import { getLocalInfo, removeLocalInfo } from "@south/utils";
// 导入axios库，用于发起HTTP请求
import axios from "axios";
// 导入自定义的AxiosRequest类，用于创建和配置axios实例
import AxiosRequest from "./request";

/**
 * 创建请求实例的函数
 * @param url - API的基础URL
 * @param tokenKey - 存储token的本地存储键名
 * @returns 返回配置好的AxiosRequest实例
 */
function creteRequest(url: string, tokenKey: string) {
  // 创建并返回一个新的AxiosRequest实例
  return new AxiosRequest({
    // 设置请求的基础URL
    baseURL: url,
    // 设置请求超时时间为180秒
    timeout: 180 * 1000,
    // 配置请求和响应拦截器
    interceptors: {
      // 请求拦截器：在请求发送前处理请求配置
      requestInterceptors(res) {
        // 从本地存储获取token
        const tokenLocal = getLocalInfo(tokenKey) || "";
        // 如果请求头存在且有token，则在请求头中添加Authorization字段
        if (res?.headers && tokenLocal) {
          res.headers.Authorization = tokenLocal as string;
        }
        // 返回处理后的请求配置
        return res;
      },
      // 请求错误拦截器：处理请求发送前的错误
      requestInterceptorsCatch(err) {
        // 显示请求超时的错误消息
        message.error("请求超时！");
        // 返回错误对象，允许错误继续传播
        return err;
      },
      // 响应拦截器：处理服务器返回的响应
      responseInterceptors(res) {
        // 从响应中提取数据
        const { data } = res;

        // 处理权限不足的情况（状态码401）
        if (data?.code === 401) {
          // 获取当前语言设置
          const lang = localStorage.getItem("lang");
          // 准备英文和中文的错误消息
          const enMsg = "Insufficient permissions, please log in again!";
          const zhMsg = "权限不足，请重新登录！";
          // 根据当前语言选择对应的消息
          const msg = lang === "en" ? enMsg : zhMsg;
          // 移除本地存储中的token
          removeLocalInfo(tokenKey);
          // 显示错误消息
          message.error({
            content: msg,
            key: "error",
          });
          // 在控制台输出错误信息
          console.error("错误信息:", data?.message || msg);

          // 跳转到登录页
          const url = window.location.href;
          if (url.includes("#")) {
            // 如果URL包含#，使用hash路由方式跳转
            window.location.hash = "/login";
          } else {
            // 否则使用普通方式跳转，延时是为了确保message能够显示
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }
          // 返回响应对象
          return res;
        }

        // 处理其他错误情况（状态码不是200）
        if (data?.code !== 200) {
          // 调用handleError函数处理错误
          handleError(data?.message);
          // 返回响应对象
          return res;
        }

        // 如果没有错误，直接返回响应对象
        return res;
      },
      // 响应错误拦截器：处理服务器返回的错误
      responseInterceptorsCatch(err) {
        // 检查是否是取消请求导致的错误
        if (axios.isCancel(err)) {
          // 如果是取消请求，确保err.data存在，并返回错误对象
          err.data = err.data || {};
          return err;
        }

        // 处理服务器错误
        handleError("服务器错误！");
        // 返回错误对象
        return err;
      },
    },
  });
}

/**
 * 错误处理函数
 * @param error - 错误信息
 * @param content - 自定义错误内容（可选）
 */
const handleError = (error: string, content?: string) => {
  // 在控制台输出错误信息
  console.error("错误信息:", error);
  // 显示错误消息
  message.error({
    content: content || error || "服务器错误",
    key: "error",
  });
};

// 导出creteRequest函数
export { creteRequest };
// 导出所有类型定义
export type * from "./types";
