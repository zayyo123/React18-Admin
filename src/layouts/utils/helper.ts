/**
 * layouts/utils/helper.ts
 *
 * 这个文件提供了布局相关的工具函数，主要包括：
 * 1. 版本检查和自动更新功能
 * 2. 根据路由路径获取对应的标签名称（支持多语言）
 */

// 导入标签数据类型定义，用于类型检查
import type { TabsData } from "@/stores/tabs";
// 导入消息实例类型，用于显示提示消息
import type { MessageInstance } from "antd/es/message/interface";
// 导入常量配置，LANG为语言设置键名，VERSION为版本信息键名
import { LANG, VERSION } from "@/utils/config";
// 导入axios用于发起HTTP请求
import axios from "axios";

/**
 * 版本监控函数
 * 检查应用版本是否有更新，如有更新则提示用户并自动刷新页面
 *
 * @param messageApi - Ant Design的消息API实例，用于显示提示信息
 */
export const versionCheck = async (messageApi: MessageInstance) => {
  // 在开发环境下不执行版本检查，直接返回
  if (import.meta.env.MODE === "development") return;

  // 从本地存储获取当前缓存的版本号
  const versionLocal = localStorage.getItem(VERSION);

  // 发起HTTP请求获取最新版本信息
  // 通常version.json文件会在构建时生成，包含最新的版本号
  const {
    data: { version },
  } = await axios.get("version.json");

  // 首次进入应用（没有本地版本记录）则缓存当前版本号并返回
  // 这样下次进入时才能比较版本是否有变化
  if (version && !versionLocal) {
    return localStorage.setItem(VERSION, String(version));
  }

  // 如果有新版本（当前版本与本地缓存版本不同）
  if (version && versionLocal !== String(version)) {
    // 更新本地存储的版本号为最新版本
    localStorage.setItem(VERSION, String(version));

    // 显示更新提示消息
    messageApi.info({
      content: "发现新内容，自动更新中...", // 提示内容
      key: "reload", // 消息的唯一标识，防止重复显示
      onClose: () => {
        // 消息关闭后，设置一个定时器，延迟刷新页面
        // 设置60秒延迟，给用户足够时间完成当前操作
        let timer: NodeJS.Timeout | null = setTimeout(() => {
          // 清除定时器，防止内存泄漏
          clearTimeout(timer as NodeJS.Timeout);
          timer = null;
          // 刷新页面，加载最新版本
          window.location.reload();
        }, 60000); // 60秒后自动刷新
      },
    });
  }
  // 如果版本相同，则不做任何操作
};

/**
 * 通过路由路径获取对应的标签名称
 * 支持多语言，根据当前语言设置返回相应语言的标签名
 *
 * @param tabs - 标签数据数组，包含所有可能的标签信息
 * @param path - 当前路由路径，用于匹配对应的标签
 * @returns 返回匹配到的标签名称，如果没有匹配到则返回空字符串
 */
export const getTabTitle = (tabs: TabsData[], path: string): string => {
  // 从本地存储获取当前语言设置
  const lang = localStorage.getItem(LANG);

  // 遍历标签数组，查找匹配当前路径的标签
  for (let i = 0; i < tabs?.length; i++) {
    const item = tabs[i];

    // 如果找到匹配的标签（key等于当前路径）
    if (item.key === path) {
      // 解构获取标签的各语言版本名称
      const { label, labelEn, labelZh } = item;

      // 根据当前语言设置选择对应的标签名
      // 如果当前语言是英文，则使用英文标签名(labelEn)
      // 否则使用中文标签名(labelZh)，如果中文标签名不存在则使用默认标签名(label)
      const result = lang === "en" ? labelEn : labelZh || label;

      // 返回找到的标签名，并确保类型为字符串
      return result as string;
    }
  }

  // 如果没有找到匹配的标签，返回空字符串
  return "";
};
