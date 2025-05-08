/**
 * utils/helper.ts
 *
 * 这个文件提供了应用中常用的工具函数集合。
 * 包含各种通用的辅助函数，如字符串处理、数据转换、URL参数解析等。
 * 这些函数被设计为纯函数，不依赖于特定的应用状态，可以在应用的任何地方使用。
 */

// 导入类型定义
import type { ArrayData } from "#/public"; // 数组数据类型
import type { Constant } from "./constants"; // 常量类型定义
import type { TFunction } from "i18next"; // i18next翻译函数类型

// 导入应用配置
import { TITLE_SUFFIX } from "@/utils/config"; // 页面标题后缀

/**
 * 首字母大写
 * 将字符串的第一个字符转换为大写，其余字符保持不变
 *
 * @param str - 要处理的字符串
 * @returns 首字母大写后的字符串，如果输入无效则返回空字符串
 *
 * @example
 * firstCapitalize('hello') // 返回 'Hello'
 * firstCapitalize('world') // 返回 'World'
 * firstCapitalize('') // 返回 ''
 * firstCapitalize(null) // 返回 ''
 */
export function firstCapitalize(str: string): string {
  // 检查输入是否为有效字符串
  if (!str || typeof str !== "string") return "";

  // 将第一个字符转换为大写，并与剩余部分拼接
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

/**
 * 金额格式化
 * 将数字转换为带千位分隔符的字符串表示
 *
 * @param amount - 要格式化的金额数字
 * @returns 格式化后的金额字符串，每三位数字用逗号分隔
 *
 * @example
 * amountFormatter(3000) // 返回 '3,000'
 * amountFormatter(1234567) // 返回 '1,234,567'
 * amountFormatter(0) // 返回 '0'
 */
export function amountFormatter(amount: number) {
  // 将数字转换为字符串，然后使用正则表达式添加千位分隔符
  // \B 表示非单词边界
  // (?=(\d{3})+(?!\d)) 表示后面跟着3的倍数个数字，且之后没有数字的位置
  return `${amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 生成指定范围内的随机整数
 * @param min - 随机数的最小值（包含）
 * @param max - 随机数的最大值（包含）
 * @returns 生成的随机整数
 *
 * @example
 * randomNum(1, 10) // 返回1到10之间的随机整数
 * randomNum(0, 100) // 返回0到100之间的随机整数
 *
 * @note 注意：当前实现有一个bug，min和max的位置在计算中是反的，
 * 正确实现应该是 Math.floor(Math.random() * (max - min + 1) + min)
 */
export function randomNum(min: number, max: number): number {
  // 注意：这里的实现有问题，min和max的位置是反的
  // 正确实现应该是：Math.floor(Math.random() * (max - min + 1) + min)
  const num = Math.floor(Math.random() * (min - max) + max);
  return num;
}

/**
 * 值转化为标签
 * 根据值在常量数组中查找对应的标签文本
 *
 * @param value - 要查找的值（可以是字符串、数字或布尔值）
 * @param arr - 常量数组，每个元素包含value和label属性
 * @returns 找到的标签文本，如果未找到则返回空字符串
 *
 * @example
 * const constants = [
 *   { value: 1, label: '启用' },
 *   { value: 0, label: '禁用' }
 * ];
 * valueToLabel(1, constants) // 返回 '启用'
 * valueToLabel(0, constants) // 返回 '禁用'
 * valueToLabel(2, constants) // 返回 ''
 */
export function valueToLabel(
  value: string | number | boolean,
  arr: Constant[]
): string {
  // 遍历常量数组
  for (let i = 0; i < arr?.length; i++) {
    // 如果找到匹配的值，返回对应的标签
    if (arr[i].value === value) {
      return arr[i].label;
    }
  }

  // 如果未找到匹配的值，返回空字符串
  return "";
}

/**
 * 获取URL中指定参数的值
 * 解析URL查询字符串，提取指定参数名对应的值
 *
 * @param search - URL查询字符串，可以包含或不包含前导问号(?)
 * @param key - 要查找的参数名
 * @returns 参数值，如果参数不存在则返回空字符串
 *
 * @example
 * getUrlParam('?id=123&name=test', 'id') // 返回 '123'
 * getUrlParam('id=123&name=test', 'name') // 返回 'test'
 * getUrlParam('id=123&name=test', 'age') // 返回 ''
 * getUrlParam('', 'id') // 返回 ''
 */
export function getUrlParam(search: string, key: string) {
  // 如果查询字符串或参数名为空，直接返回空字符串
  if (!search || !key) return "";

  // 去除查询字符串开头的问号(?)，如果存在的话
  if (search?.[0] === "?") search = search.substring(1, search.length);

  // 按&符号分割查询字符串，得到参数数组
  const arr = search.split("&"); // 分割数组

  // 创建一个二维数组，存储参数名和参数值的对
  const pairArr: [string, string][] = [];

  // 遍历参数数组，解析每个参数
  for (let i = 0; i < arr.length; i++) {
    // 按=符号分割参数，得到参数名和参数值
    const value = arr[i]?.split("=");
    // 只有当分割结果包含两个元素时才是有效的参数
    if (value?.length === 2) {
      // 将参数名和参数值作为一对添加到结果数组
      pairArr.push([value[0], value[1]]);
    }
  }

  // 遍历结果数组，查找匹配的参数名
  for (let i = 0; i < pairArr.length; i++) {
    // 如果找到匹配的参数名，返回对应的参数值
    if (pairArr[i][0] === key) {
      return pairArr[i][1];
    }
  }

  // 如果未找到匹配的参数名，返回空字符串
  return "";
}

/**
 * 过滤空数据
 * @param obj - 传入对象
 */
type EmptyData = Record<string, unknown>;
export function filterEmptyValue(obj: EmptyData): EmptyData {
  // 创建一个新的空对象，用于存储过滤后的结果
  const res: EmptyData = {};

  // 遍历输入对象的所有属性
  for (let key in obj) {
    // 去除key中多余的空格
    key = key.trim();

    // undefined过滤 - 如果值是undefined，跳过这个属性
    if (obj[key] === undefined) continue;

    // null过滤 - 如果值是null，跳过这个属性
    if (obj[key] === null) continue;

    // 空数组过滤 - 如果值是空数组，跳过这个属性
    if (obj[key]?.constructor === Array && (obj[key] as ArrayData).length === 0)
      continue;

    // 空字符串过滤 - 如果值是空字符串，跳过这个属性
    if (obj[key]?.constructor === String && (obj[key] as string).length === 0)
      continue;

    // 空对象过滤 - 如果值是空对象，跳过这个属性
    if (
      obj[key]?.constructor === Object &&
      Object.keys(obj[key] as object).length === 0
    )
      continue;

    // 去除字符串多余空格 - 如果值是字符串，去除两端空格
    if (obj[key]?.constructor === String) {
      res[key] = (obj[key] as string).trim();
    } else {
      // 对于非字符串值，直接保留
      res[key] = obj[key];
    }
  }

  // 返回过滤后的对象
  return res;
}

/**
 * 递归数据
 * @param data - 数据源
 */
interface RecursiveChildren<T> {
  children?: T[];
}
export function recursiveData<T extends RecursiveChildren<T>, U>(
  data: T[],
  callback: (data: T) => U
): U[] {
  // 如果数据源为空数组，直接返回空数组
  if (data.length === 0) return [];

  // 创建一个新的空数组，用于存储处理后的结果
  const res: U[] = [];

  // 遍历数据源中的每个元素
  for (let i = 0; i < data.length; i++) {
    // 获取当前元素
    const element = data[i];
    // 使用回调函数处理当前元素，获取处理后的数据
    const filterData = callback(element);
    // 如果当前元素有children属性，递归处理children
    const children = element.children
      ? recursiveData(element.children, callback)
      : undefined;
    // 将处理后的数据和递归处理的children合并，添加到结果数组
    res.push({ ...filterData, children });
  }

  // 返回处理后的结果数组
  return res;
}

/**
 * 设置标题
 * @param t - 国际化
 * @param title - 标题
 */
export function setTitle(t: TFunction, title: string) {
  // 构建完整的标题，如果有传入标题则添加连字符，否则只使用后缀
  const value = `${title ? title + "-" : ""}${TITLE_SUFFIX(t)}`;

  // 如果当前文档标题已经是目标值，则不做任何操作
  if (document.title === value) return;

  // 设置文档标题为构建的完整标题
  document.title = value;
}
