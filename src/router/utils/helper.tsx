/**
 * router/utils/helper.tsx
 *
 * 这个文件提供了路由处理的工具函数，主要功能包括：
 * 1. 处理动态导入的页面组件，转换为路由配置
 * 2. 过滤排除特定路由
 * 3. 处理动态参数路由（如 [id] 转换为 :id）
 * 4. 简化路由路径（如 /user/index 简化为 /user/）
 */

// 导入类型定义
import type { RouteObject } from "react-router-dom"; // 路由对象类型
import type { DefaultComponent } from "@loadable/component"; // 默认组件类型

// 导入Ant Design组件
import { Skeleton } from "antd"; // 骨架屏组件，用于加载中显示

// 导入路由排除配置
import { ROUTER_EXCLUDE } from "./config"; // 需要排除的路由列表

// 导入组件懒加载工具
import loadable from "@loadable/component"; // 用于组件的动态导入和懒加载

/**
 * 路由添加layout
 * 过滤路由配置，排除登录页，为其他页面添加布局
 *
 * @param routes - 路由配置数组
 * @returns 过滤后的路由配置数组
 */
export function layoutRoutes(routes: RouteObject[]): RouteObject[] {
  // 创建一个新数组，用于存储需要添加布局的路由
  const layouts: RouteObject[] = []; // layout内部组件

  // 遍历所有路由
  for (let i = 0; i < routes.length; i++) {
    // 解构获取路由路径
    const { path } = routes[i];

    // 路径为登录页不添加layouts
    // 登录页通常有独立的布局，不需要包含在主布局中
    if (path !== "login") {
      // 将非登录页的路由添加到layouts数组
      layouts.push(routes[i]);
    }
  }

  // 返回过滤后的路由数组
  return layouts;
}

/**
 * 处理路由配置
 * 将动态导入的页面组件转换为React Router的路由配置
 *
 * @param routes - 动态导入的页面组件映射，键是文件路径，值是导入函数
 * @returns 处理后的路由配置数组
 */
export function handleRoutes(
  routes: Record<string, () => Promise<DefaultComponent<unknown>>>
): RouteObject[] {
  // 创建一个新数组，用于存储处理后的路由配置
  const layouts: RouteObject[] = []; // layout内部组件

  // 遍历所有动态导入的页面组件
  for (const key in routes) {
    // 检查路由是否在排除名单中
    const isExclude = handleRouterExclude(key);
    // 如果路由需要被排除，则跳过当前迭代
    if (isExclude) continue;

    // 根据文件路径生成路由路径
    const path = getRouterPage(key);
    // 如果是登录页面，则跳过（登录页通常有单独的路由配置）
    if (path === "/login") continue;

    // 使用loadable创建懒加载组件
    // 这样组件只会在需要时才被加载，提高应用性能
    const ComponentNode = loadable(routes[key], {
      // 设置加载时的占位符，显示骨架屏提升用户体验
      fallback: (
        // 创建一个加载骨架屏，显示加载中的效果
        <Skeleton active className="p-30px" paragraph={{ rows: 10 }} />
      ),
    });

    // 将处理后的路由配置添加到数组中
    layouts.push({
      path, // 路由路径
      element: <ComponentNode />, // 路由对应的组件
    });
  }

  // 返回处理后的路由配置数组
  return layouts;
}

/**
 * 预处理正则表达式，避免重复创建
 * 将排除列表转换为正则表达式，用于快速匹配需要排除的路由
 *
 * 处理逻辑：
 * 1. 对于不包含点(.)的项，添加前后斜杠，如 'login' 变为 '/login/'
 * 2. 包含点(.)的项保持不变，通常是文件扩展名，如 '.test.tsx'
 * 3. 使用 | 连接所有项，创建一个OR匹配的正则表达式
 * 4. 使用 i 标志使匹配不区分大小写
 */
const ROUTER_EXCLUDE_REGEX = new RegExp(
  ROUTER_EXCLUDE.map((item) => (!item.includes(".") ? `/${item}/` : item)).join(
    "|"
  ),
  "i" // 不区分大小写
);

/**
 * 检查路由是否在排除名单中
 * 使用预处理的正则表达式进行匹配
 *
 * @param path - 要检查的路径
 * @returns 如果路径在排除名单中返回true，否则返回false
 */
function handleRouterExclude(path: string): boolean {
  // 使用正则表达式测试路径是否匹配排除模式
  return ROUTER_EXCLUDE_REGEX.test(path);
}

/**
 * 处理动态参数路由
 * 将Next.js风格的动态路由参数 [param] 转换为React Router风格的 :param
 *
 * @param path - 包含动态参数的路由路径
 * @returns 转换后的路由路径
 *
 * 示例:
 * - 输入: "/users/[id]/profile"
 * - 输出: "/users/:id/profile"
 */
const handleRouterDynamic = (path: string): string => {
  // 将所有的左方括号 [ 替换为冒号 :
  // 这将动态参数的开始标记从 [ 转换为 :
  path = path.replace(/\[/g, ":");

  // 将所有的右方括号 ] 删除
  // 完成动态参数的转换
  path = path.replace(/\]/g, "");

  // 返回转换后的路径
  return path;
};

/**
 * 从文件路径获取路由路径
 * 将文件系统路径转换为URL路径
 *
 * @param path - 文件系统路径
 * @returns 转换后的URL路径
 *
 * 处理规则:
 * 1. 移除"pages"前缀和文件扩展名
 * 2. 将"/index"路径简化为"/"
 * 3. 将以"index"结尾的路径简化（如"/user/index"简化为"/user/"）
 * 4. 处理动态参数路由
 */
function getRouterPage(path: string): string {
  // 获取"pages"目录后的路径起始位置
  // 加5是为了跳过"pages"这个词本身
  const pageIndex = path.indexOf("pages") + 5;

  // 获取文件扩展名的起始位置
  const lastIndex = path.lastIndexOf(".");

  // 提取有效路径：去除"pages"前缀和文件扩展名
  let result = path.substring(pageIndex, lastIndex);

  // 特殊处理：如果路径是"/index"，则简化为根路径"/"
  if (result === "/index") return "/";

  // 处理以"index"结尾的路径
  // 当一个路径以"index"结尾时（如"/user/index"），通常在Web应用中会简化为"/user/"
  if (result.includes("index")) {
    // 获取"index"在路径中的位置，并加上"index"的长度(5)
    const indexIdx = result.lastIndexOf("index") + 5;

    // 如果"index"正好在路径的末尾
    if (indexIdx === result.length) {
      // 移除末尾的"index"，保留路径的其余部分
      // 例如："/user/index" -> "/user/"
      result = result.substring(0, result.length - 6); // 6 = "index".length + 1(斜杠)
    }
  }

  // 处理动态参数路由
  // 检查路径中是否包含方括号，表示动态参数
  if (result.includes("[") && result.includes("]")) {
    // 将动态参数转换为React Router格式
    result = handleRouterDynamic(result);
  }

  // 返回处理后的路由路径
  return result;
}
