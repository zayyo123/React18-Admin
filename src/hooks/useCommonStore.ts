/**
 * hooks/useCommonStore.ts
 *
 * 这个文件定义了一个自定义Hook，用于集中访问应用中的常用状态。
 * 主要功能是从多个状态存储中提取常用状态，并将它们组合成一个统一的对象返回。
 * 这样可以简化组件中的状态访问，避免在组件中导入多个状态存储。
 */

// 导入所有状态存储钩子
import {
  useMenuStore,
  usePublicStore,
  useTabsStore,
  useUserStore,
} from "@/stores";

/**
 * useCommonStore 自定义Hook
 * 集中获取应用中常用的状态数据，提供一个统一的访问点
 *
 * @returns 包含常用状态的对象，使用as const确保返回类型为只读元组
 */
export const useCommonStore = () => {
  // 从用户状态存储中获取数据
  // 用户权限列表
  const permissions = useUserStore((state) => state.permissions);
  // 用户ID，用于标识当前登录用户
  const userId = useUserStore((state) => state.userInfo.id);
  // 用户名，用于显示当前登录用户的名称
  const username = useUserStore((state) => state.userInfo.username);

  // 从标签页状态存储中获取数据
  // 是否窗口最大化，控制内容区域的显示方式
  const isMaximize = useTabsStore((state) => state.isMaximize);
  // 导航数据，用于面包屑导航
  const nav = useTabsStore((state) => state.nav);
  // 标签页数据，显示已打开的页面标签
  const tabs = useTabsStore((state) => state.tabs);

  // 从菜单状态存储中获取数据
  // 菜单是否折叠，控制侧边菜单的显示方式
  const isCollapsed = useMenuStore((state) => state.isCollapsed);
  // 是否为手机视图，用于响应式布局
  const isPhone = useMenuStore((state) => state.isPhone);
  // 菜单打开的项目，控制菜单的展开状态
  const openKeys = useMenuStore((state) => state.openKeys);
  // 菜单选中的项目，标识当前激活的菜单项
  const selectedKeys = useMenuStore((state) => state.selectedKeys);
  // 菜单数据，包含所有菜单项的结构和配置
  const menuList = useMenuStore((state) => state.menuList);

  // 从公共状态存储中获取数据
  // 是否正在刷新，用于显示加载指示器
  const isRefresh = usePublicStore((state) => state.isRefresh);
  // 是否全屏模式，控制页面的显示方式
  const isFullscreen = usePublicStore((state) => state.isFullscreen);
  // 当前主题，控制应用的外观（暗色/亮色）
  const theme = usePublicStore((state) => state.theme);

  // 返回所有获取的状态，组合成一个统一的对象
  // 使用as const确保返回类型为只读元组，提供更好的类型推断
  return {
    // 布局相关状态
    isMaximize, // 是否最大化
    isCollapsed, // 菜单是否折叠
    isPhone, // 是否手机视图
    isRefresh, // 是否刷新中
    isFullscreen, // 是否全屏

    // 导航相关状态
    nav, // 导航数据
    openKeys, // 菜单展开项
    selectedKeys, // 菜单选中项
    tabs, // 标签页数据

    // 用户相关状态
    permissions, // 权限列表
    userId, // 用户ID
    username, // 用户名

    // 其他状态
    theme, // 主题
    menuList, // 菜单数据
  } as const;
};
