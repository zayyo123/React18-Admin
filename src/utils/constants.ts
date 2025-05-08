import type { TFunction } from "i18next";
import { DefaultOptionType } from "antd/es/select";

/**
 * @description: 公用常量
 * 这个文件定义了应用中使用的各种常量和枚举值
 */

/**
 * 颜色
 * 定义了系统中使用的标准颜色枚举
 */
export enum colors {
  success = "green", // 成功状态颜色 - 绿色
  primary = "#409EFF", // 主要颜色 - 蓝色
  warning = "#E6A23C", // 警告状态颜色 - 橙色
  danger = "red", // 危险/错误状态颜色 - 红色
  info = "#909399", // 信息状态颜色 - 灰色
}

/**
 * 常量接口定义
 * 继承自Ant Design的DefaultOptionType，但排除了'children'属性，然后重新定义
 */
export interface Constant extends Omit<DefaultOptionType, "children"> {
  value: string | number; // 选项的值，可以是字符串或数字
  label: string; // 选项的显示文本
  color?: colors; // 可选的颜色属性，使用colors枚举中定义的颜色
  children?: Constant[]; // 可选的子选项数组，用于嵌套选项结构
}

/**
 * 开启状态
 * 定义了表示开启/关闭状态的常量数组
 * @param t - 国际化翻译函数，用于多语言支持
 * @returns 包含开启和关闭两个选项的常量数组
 */
export const OPEN_CLOSE = (t: TFunction): Constant[] => [
  { label: t("public.open"), value: 1 }, // 开启状态，值为1，标签使用翻译后的"开启"文本
  { label: t("public.close"), value: 0 }, // 关闭状态，值为0，标签使用翻译后的"关闭"文本
];

/**
 * 菜单状态
 * 定义了表示菜单显示/隐藏状态的常量数组
 * @param t - 国际化翻译函数，用于多语言支持
 * @returns 包含显示和隐藏两个选项的常量数组
 */
export const MENU_STATUS = (t: TFunction): Constant[] => [
  { label: t("public.show"), value: 1 }, // 显示状态，值为1，标签使用翻译后的"显示"文本
  { label: t("public.hide"), value: 0 }, // 隐藏状态，值为0，标签使用翻译后的"隐藏"文本
];

/**
 * 菜单模块
 * 定义了系统中各个模块的常量数组
 * @param t - 国际化翻译函数，用于多语言支持
 * @returns 包含各个系统模块的常量数组
 */
export const MENU_MODULE = (t: TFunction): Constant[] => [
  { value: "authority", label: t("system.authority") }, // 权限模块
  { value: "platform", label: t("system.platform") }, // 平台模块
  { value: "stat", label: t("system.stat") }, // 统计模块
  { value: "ad", label: t("system.ad") }, // 广告模块
  { value: "cs", label: t("system.cs") }, // 客服模块
  { value: "log", label: t("system.log") }, // 日志模块
];

/**
 * 菜单作用类型
 * 定义了系统中各种操作动作的常量数组
 * @param t - 国际化翻译函数，用于多语言支持
 * @returns 包含各种操作动作的常量数组
 */
export const MENU_ACTIONS = (t: TFunction): Constant[] => [
  { value: "create", label: t("system.create") }, // 创建操作
  { value: "update", label: t("system.update") }, // 更新操作
  { value: "delete", label: t("system.delete") }, // 删除操作
  { value: "detail", label: t("system.detail") }, // 详情操作
  { value: "export", label: t("system.export") }, // 导出操作
  { value: "status", label: t("system.status") }, // 状态操作
];
