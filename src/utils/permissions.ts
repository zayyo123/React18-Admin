/**
 * 检测是否有权限
 * 这个函数用于检查用户是否拥有特定的权限
 *
 * @param value - 检测值，表示要检查的权限标识符（通常是一个路径或权限代码）
 * @param permissions - 权限数组，包含用户拥有的所有权限标识符
 * @returns 布尔值，表示用户是否拥有指定的权限
 *
 * @example
 * // 检查用户是否拥有 '/system/user' 权限
 * const hasPermission = checkPermission('/system/user', userPermissions);
 * if (hasPermission) {
 *   // 用户有权限，执行相应操作
 * } else {
 *   // 用户无权限，可能需要显示禁止访问的提示或隐藏相关功能
 * }
 */
export const checkPermission = (
  value: string,
  permissions: string[]
): boolean => {
  if (!permissions || permissions.length === 0) return false;
  return permissions.includes(value);
};
