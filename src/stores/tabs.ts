/**
 * stores/tabs.ts
 *
 * 这个文件定义了应用的标签页状态管理，使用Zustand库实现。
 * 主要功能包括：
 * 1. 标签页的增加、删除、切换等操作
 * 2. 多语言支持
 * 3. 标签页状态的持久化存储
 * 4. 与页面缓存(KeepAlive)的集成
 */

// 导入Ant Design的标签页属性类型
import type { TabPaneProps } from "antd";
// 导入导航数据类型，用于面包屑导航
import type { NavData } from "@/menus/utils/helper";
// 导入KeepAlive控制器类型，用于管理页面缓存
import type { AliveController } from "react-activation";
// 导入Zustand持久化中间件，用于将状态保存到localStorage
import { persist, createJSONStorage } from "zustand/middleware";
// 导入Zustand的核心create函数，用于创建状态存储
import { create } from "zustand";
// 导入Zustand开发工具中间件，用于调试
import { devtools } from "zustand/middleware";

/**
 * 标签页数据接口
 * 继承自Ant Design的TabPaneProps，但排除了'tab'属性
 */
export interface TabsData extends Omit<TabPaneProps, "tab"> {
  key: string; // 标签的唯一标识，通常是路由路径
  label: React.ReactNode; // 标签显示的文本或组件
  labelZh: React.ReactNode; // 中文标签文本
  labelEn: React.ReactNode; // 英文标签文本
  nav: NavData[]; // 导航数据，用于面包屑导航
}

/**
 * 标签页跳转接口
 * 用于关闭当前标签并跳转到指定路径
 */
interface TabsGoNext {
  key: string; // 要关闭的标签的key
  nextPath: string; // 关闭后要跳转的路径
  dropScope: AliveController["dropScope"]; // KeepAlive的清除缓存函数
}

/**
 * 标签页状态接口
 * 定义了标签页状态存储的所有状态和操作方法
 */
interface TabsState {
  // 状态
  isCloseTabsLock: boolean; // 是否锁定标签关闭操作，防止连续关闭导致的问题
  isMaximize: boolean; // 是否最大化内容区域
  activeKey: string; // 当前激活的标签key
  nav: NavData[]; // 当前导航数据
  tabs: TabsData[]; // 所有打开的标签数据

  // 操作方法
  toggleCloseTabsLock: (isCloseTabsLock: boolean) => void; // 切换关闭锁定状态
  toggleMaximize: (isMaximize: boolean) => void; // 切换最大化状态
  setActiveKey: (key: string) => void; // 设置当前激活的标签
  setNav: (nav: NavData[]) => void; // 设置导航数据
  switchTabsLang: (label: string) => void; // 切换标签语言
  addTabs: (payload: TabsData) => void; // 添加新标签
  closeTabs: (payload: string, dropScope: AliveController["dropScope"]) => void; // 关闭指定标签
  closeTabGoNext: (payload: TabsGoNext) => void; // 关闭标签并跳转
  closeLeft: (payload: string, dropScope: AliveController["dropScope"]) => void; // 关闭左侧所有标签
  closeRight: (
    payload: string,
    dropScope: AliveController["dropScope"]
  ) => void; // 关闭右侧所有标签
  closeOther: (
    payload: string,
    dropScope: AliveController["dropScope"]
  ) => void; // 关闭其他所有标签
  closeAllTab: () => void; // 关闭所有标签
}

/**
 * 创建标签页状态存储
 * 使用Zustand的create函数创建状态管理器
 * 应用了devtools和persist中间件，实现调试和持久化功能
 */
export const useTabsStore = create<TabsState>()(
  // 开发工具中间件，仅在开发环境启用
  devtools(
    // 持久化中间件，将状态保存到localStorage
    persist(
      // 状态定义函数，接收set函数用于更新状态
      (set) => ({
        // 初始状态
        isCloseTabsLock: false, // 初始不锁定标签关闭
        isMaximize: false, // 初始不最大化
        activeKey: "", // 初始无激活标签
        nav: [], // 初始导航数据为空
        tabs: [], // 初始标签列表为空

        // 切换关闭锁定状态
        toggleCloseTabsLock: (isCloseTabsLock) => set({ isCloseTabsLock }),

        // 切换最大化状态
        toggleMaximize: (isMaximize) => set({ isMaximize }),

        // 设置当前激活的标签
        setActiveKey: (key) => set({ activeKey: key }),

        // 设置导航数据
        setNav: (nav) => set({ nav }),

        /**
         * 切换标签语言
         * 根据传入的语言代码(en/zh)切换所有标签的显示语言
         * @param label - 语言代码，'en'表示英文，其他值表示中文
         */
        switchTabsLang: (label) =>
          set((state) => {
            const { tabs } = state;
            // 遍历所有标签，更新label为对应语言的文本
            for (let i = 0; i < tabs?.length; i++) {
              const item = tabs[i];
              // 如果语言是英文，使用英文标签，否则使用中文标签
              item.label = label === "en" ? item.labelEn : item.labelZh;
            }
            return { tabs };
          }),

        /**
         * 添加新标签
         * 如果标签不存在则添加，已存在则不做操作
         * @param payload - 要添加的标签数据
         */
        addTabs: (payload) =>
          set((state) => {
            const { tabs } = state;
            // 检查标签是否已存在
            const has = tabs.find((item) => item.key === payload.key);
            // 如果不存在则添加
            if (!has) tabs.push(payload);

            // 设置第一个标签的关闭按钮状态
            // 只有当有多个标签时，第一个标签才可关闭
            if (tabs.length) tabs[0].closable = tabs.length > 1;

            return { tabs };
          }),

        /**
         * 关闭指定标签
         * 关闭标签并根据情况切换到其他标签
         * @param payload - 要关闭的标签key
         * @param dropScope - KeepAlive的清除缓存函数
         */
        closeTabs: (payload, dropScope) =>
          set((state) => {
            const { tabs } = state;
            // 查找要关闭的标签索引
            const index = tabs.findIndex((item) => item.key === payload);
            // 如果找到则从数组中移除
            if (index >= 0) tabs.splice(index, 1);

            // 如果关闭的是当前激活的标签，需要激活其他标签
            if (payload === state.activeKey) {
              let target = "";
              // 优先激活关闭标签后面的标签
              if (index < tabs.length) {
                target = tabs?.[index]?.key || "";
              } else {
                // 如果关闭的是最后一个标签，则激活前一个标签
                target = tabs[index - 1]?.key || "";
              }
              // 设置新的激活标签并锁定关闭操作
              set({ activeKey: target, isCloseTabsLock: true });
            }

            // 更新第一个标签的关闭按钮状态
            if (tabs.length) tabs[0].closable = tabs.length > 1;

            // 清除关闭标签的KeepAlive缓存
            dropScope(payload);

            return { tabs };
          }),

        /**
         * 关闭标签并跳转到指定路径
         * @param payload - 包含要关闭的标签key、跳转路径和清除缓存函数
         */
        closeTabGoNext: (payload) =>
          set((state) => {
            const { tabs } = state;
            // 解构获取参数
            const { key, nextPath, dropScope } = payload;
            // 查找要关闭的标签索引
            const index = tabs.findIndex((item) => item.key === key);
            // 如果找到则从数组中移除
            if (index >= 0) tabs.splice(index, 1);

            // 如果关闭的是当前激活的标签，跳转到指定路径
            if (key === state.activeKey) {
              set({ activeKey: nextPath, isCloseTabsLock: true });
            }

            // 更新第一个标签的关闭按钮状态
            if (tabs.length) tabs[0].closable = tabs.length > 1;

            // 清除关闭标签的KeepAlive缓存
            dropScope(key);

            return { tabs };
          }),

        /**
         * 关闭指定标签左侧的所有标签
         * @param payload - 参考标签key，关闭此标签左侧的所有标签
         * @param dropScope - KeepAlive的清除缓存函数
         */
        closeLeft: (payload, dropScope) =>
          set((state) => {
            const { tabs, activeKey } = state;
            // 查找参考标签的索引
            const index = tabs.findIndex((item) => item.key === payload);
            // 如果找到则移除此索引之前的所有标签
            if (index >= 0) tabs.splice(0, index);
            // 设置第一个标签为激活状态
            set({ activeKey: tabs[0]?.key || "" });

            // 如果当前激活的标签不是参考标签，则锁定关闭操作
            // 这通常意味着当前激活的标签被关闭了
            if (activeKey !== payload) {
              set({ isCloseTabsLock: true });
            }

            // 更新第一个标签的关闭按钮状态
            if (tabs.length) tabs[0].closable = tabs.length > 1;

            // 清除所有被关闭标签的KeepAlive缓存
            for (let i = 0; i < tabs?.length; i++) {
              const item = tabs[i];
              if (item.key !== payload) {
                dropScope(item.key);
              }
            }

            return { tabs };
          }),

        /**
         * 关闭指定标签右侧的所有标签
         * @param payload - 参考标签key，关闭此标签右侧的所有标签
         * @param dropScope - KeepAlive的清除缓存函数
         */
        closeRight: (payload, dropScope) =>
          set((state) => {
            const { tabs, activeKey } = state;

            // 清除所有将被关闭标签的KeepAlive缓存
            for (let i = 0; i < tabs?.length; i++) {
              const item = tabs[i];
              if (item.key !== payload) {
                dropScope(item.key);
              }
            }

            // 查找参考标签的索引
            const index = tabs.findIndex((item) => item.key === payload);
            // 如果找到则移除此索引之后的所有标签
            if (index >= 0) tabs.splice(index + 1, tabs.length - index - 1);
            // 设置最后一个标签为激活状态
            set({ activeKey: tabs[tabs.length - 1]?.key || "" });

            // 如果当前激活的标签不是参考标签，则锁定关闭操作
            if (activeKey !== payload) {
              set({ isCloseTabsLock: true });
            }

            // 更新第一个标签的关闭按钮状态
            if (tabs.length) tabs[0].closable = tabs.length > 1;

            return { tabs };
          }),

        /**
         * 关闭除指定标签外的所有其他标签
         * @param payload - 要保留的标签key
         * @param dropScope - KeepAlive的清除缓存函数
         */
        closeOther: (payload, dropScope) =>
          set((state) => {
            const { tabs, activeKey } = state;
            // 创建新的标签数组，只包含要保留的标签
            const filteredTabs: TabsData[] = [];

            // 遍历所有标签
            for (let i = 0; i < tabs?.length; i++) {
              const item = tabs[i];

              // 如果是要保留的标签则添加到新数组
              if (item.key === payload) {
                filteredTabs.push(item);
              } else {
                // 清除其他标签的KeepAlive缓存
                dropScope(item.key);
              }
            }

            // 注意：这行代码没有实际效果，因为它的结果没有被使用
            // 可能是一个遗留的错误代码
            tabs.filter((item) => item.key === payload);

            // 如果当前激活的标签不是要保留的标签，则锁定关闭操作
            if (activeKey !== payload) {
              set({ isCloseTabsLock: true });
            }

            // 设置新的标签数组和激活标签
            set({ tabs: filteredTabs, activeKey: payload });

            // 更新第一个标签的关闭按钮状态
            if (filteredTabs.length)
              filteredTabs[0].closable = filteredTabs.length > 1;

            // 返回新的状态
            return {
              tabs: filteredTabs,
              activeKey: payload,
            };
          }),

        /**
         * 关闭所有标签
         * 清空标签数组并重置激活标签
         */
        closeAllTab: () => {
          // 设置空标签数组和空激活标签
          set({ tabs: [], activeKey: "" });

          // 返回新的状态
          return {
            tabs: [],
            activeKey: "",
          };
        },
      }),
      {
        // 持久化配置
        name: "tabs-storage", // 存储中的项目名称，必须是唯一的
        storage: createJSONStorage(() => localStorage), // 使用localStorage作为存储
      }
    ),
    {
      // 开发工具配置
      enabled: process.env.NODE_ENV === "development", // 仅在开发环境启用
      name: "tabsStore", // 在开发工具中显示的名称
    }
  )
);
