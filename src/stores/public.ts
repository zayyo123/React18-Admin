/**
 * stores/public.ts
 *
 * 这个文件定义了应用的公共状态管理，使用Zustand库实现。
 * 主要功能包括：
 * 1. 管理应用主题（暗色/亮色）
 * 2. 管理全屏状态
 * 3. 管理页面刷新状态
 * 4. 提供修改这些状态的方法
 */

// 导入Zustand的核心create函数，用于创建状态存储
import { create } from "zustand";

// 导入Zustand开发工具中间件，用于调试
import { devtools } from "zustand/middleware";

/**
 * 主题类型定义
 * 限制主题只能是'dark'或'light'两种值
 */
export type ThemeType = "dark" | "light";

/**
 * 公共状态接口
 * 定义了公共状态存储的所有状态和操作方法
 */
interface PublicState {
  // 状态
  theme: ThemeType; // 当前主题，'dark'或'light'
  isFullscreen: boolean; // 是否处于全屏模式
  isRefresh: boolean; // 是否正在刷新（通常用于显示加载指示器）
  isRefreshPage: boolean; // 是否需要刷新整个页面

  // 操作方法
  /**
   * 设置主题
   * @param theme - 主题类型，'dark'或'light'
   */
  setThemeValue: (theme: ThemeType) => void;

  /**
   * 设置全屏状态
   * @param isFullscreen - 是否全屏
   */
  setFullscreen: (isFullscreen: boolean) => void;

  /**
   * 设置刷新状态
   * @param isRefresh - 是否正在刷新
   */
  setRefresh: (isRefresh: boolean) => void;

  /**
   * 设置页面刷新状态
   * @param isRefreshPage - 是否需要刷新整个页面
   */
  setRefreshPage: (isRefreshPage: boolean) => void;
}

/**
 * 创建公共状态存储
 * 使用Zustand的create函数创建状态管理器
 * 应用了devtools中间件，实现调试功能
 */
export const usePublicStore = create<PublicState>()(
  // 开发工具中间件，用于在Redux DevTools中调试状态
  devtools(
    // 状态定义函数，接收set函数用于更新状态
    (set) => ({
      // 初始状态
      theme: "light", // 默认使用亮色主题
      isFullscreen: false, // 默认不是全屏模式
      isRefresh: false, // 默认不处于刷新状态
      isRefreshPage: false, // 默认不需要刷新整个页面

      /**
       * 设置主题
       * @param theme - 主题类型，'dark'或'light'
       */
      setThemeValue: (theme: ThemeType) => set({ theme }),

      /**
       * 设置全屏状态
       * @param isFullscreen - 是否全屏
       */
      setFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),

      /**
       * 设置刷新状态
       * @param isRefresh - 是否正在刷新
       */
      setRefresh: (isRefresh: boolean) => set({ isRefresh }),

      /**
       * 设置页面刷新状态
       * @param isRefreshPage - 是否需要刷新整个页面
       */
      setRefreshPage: (isRefreshPage: boolean) => set({ isRefreshPage }),
    }),
    {
      // 开发工具配置
      enabled: process.env.NODE_ENV === "development", // 仅在开发环境启用
      name: "publicStore", // 在开发工具中显示的名称
    }
  )
);
