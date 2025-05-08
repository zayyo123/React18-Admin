/**
 * 是否是方法
 * @param val - 参数
 * @returns 如果参数是函数则返回true，否则返回false
 */
export function isFunction(val: unknown): boolean {
  // 使用typeof运算符检查参数是否为'function'类型
  // 如果是函数，返回true；否则返回false
  return typeof val === "function";
}

/**
 * 是否是数字
 * @param obj - 值
 * @returns 如果参数是有效数字则返回true，否则返回false
 */
export function isNumber(obj: unknown): boolean {
  // 使用typeof运算符检查参数是否为'number'类型
  // 并使用isFinite函数检查该数字是否是有限的（排除NaN和Infinity）
  // 两个条件都满足时返回true，否则返回false
  return typeof obj === "number" && isFinite(obj);
}

/**
 * 是否是URL
 * @param path - 路径
 * @returns 如果参数是有效URL则返回true，否则返回false
 */
export function isUrl(path: string): boolean {
  // 定义一个正则表达式，用于匹配URL格式
  // 这个正则表达式可以匹配以下格式：
  // - http://example.com
  // - https://example.com
  // - www.example.com
  // - example.com
  // - example.com/path
  // - example.com/path?query=value
  // - example.com/path#fragment
  // - user@example.com
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

  // 使用正则表达式的test方法检查路径是否匹配URL格式
  // 如果匹配，返回true；否则返回false
  return reg.test(path);
}

/**
 * 是否是NULL
 * @param value - 值
 * @returns 如果参数是null则返回true，否则返回false
 */
export function isNull(value: unknown): boolean {
  // 使用严格相等运算符(===)检查参数是否为null
  // 如果是null，返回true；否则返回false
  return value === null;
}
