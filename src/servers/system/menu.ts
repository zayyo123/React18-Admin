/**
 * servers/system/menu.ts
 *
 * 这个文件提供了与菜单管理相关的API请求函数。
 * 主要功能包括：
 * 1. 菜单的增删改查操作
 * 2. 权限树的获取和保存
 * 3. 菜单列表的获取
 *
 * 所有函数都使用统一的request实例发送请求，确保请求格式和错误处理的一致性。
 */

// 导入React的Key类型，用于树形结构的键值类型定义
import type { Key } from "react";
// 导入Ant Design树组件的节点类型定义
import type { DataNode } from "antd/es/tree";
// 导入封装好的请求工具
import { request } from "@/utils/request";

/**
 * API路径枚举
 * 集中管理API路径，便于维护和修改
 */
enum API {
  URL = "/authority/menu", // 菜单相关API的基础路径
}

/**
 * 获取菜单分页数据
 * 用于获取菜单列表的分页数据，支持筛选和排序
 *
 * @param data - 请求参数，包含分页信息和筛选条件
 *               Partial<BaseFormData>表示可以包含表单数据的部分字段
 *               PaginationData包含页码、每页条数等分页信息
 * @returns 返回Promise，解析为包含菜单列表和总数的分页结果
 *          PageServerResult<BaseFormData[]>类型，包含items(数据列表)和total(总数)
 *
 * @example
 * // 获取第一页，每页10条数据
 * getMenuPage({ page: 1, pageSize: 10 })
 * // 带筛选条件的查询
 * getMenuPage({ page: 1, pageSize: 10, status: 1, keyword: 'admin' })
 */
export function getMenuPage(data: Partial<BaseFormData> & PaginationData) {
  // 发送GET请求获取分页数据
  // 将查询参数放在URL的query string中
  return request.get<PageServerResult<BaseFormData[]>>(`${API.URL}/page`, {
    params: data, // 请求参数，会被转换为query string
  });
}

/**
 * 根据ID获取菜单详情
 * 用于获取单个菜单的详细信息，通常用于编辑前的数据获取
 *
 * @param id - 菜单ID，唯一标识一个菜单项
 * @returns 返回Promise，解析为菜单详情数据
 *          BaseFormData类型，包含菜单的所有字段
 *
 * @example
 * // 获取ID为'123'的菜单详情
 * getMenuById('123')
 */
export function getMenuById(id: string) {
  // 发送GET请求获取详情数据
  // 将ID作为query参数传递
  return request.get<BaseFormData>(`${API.URL}/detail?id=${id}`); // 请求路径: /authority/menu/detail?id=xxx
}

/**
 * 创建新菜单
 * 用于添加新的菜单项到系统中
 *
 * @param data - 菜单数据，包含菜单的名称、状态、模块等信息
 *               BaseFormData类型，包含创建菜单所需的所有字段
 * @returns 返回Promise，解析为创建结果
 *          通常包含code(状态码)和message(提示信息)
 *
 * @example
 * // 创建一个新菜单
 * createMenu({
 *   name: '用户管理',
 *   status: 1,
 *   module: 'system',
 *   controller: 'user'
 * })
 */
export function createMenu(data: BaseFormData) {
  // 发送POST请求创建菜单
  // 将菜单数据放在请求体中
  return request.post(API.URL, data); // 请求路径: /authority/menu
}

/**
 * 更新菜单信息
 * 用于修改现有菜单的信息
 *
 * @param id - 要修改的菜单ID，唯一标识一个菜单项
 * @param data - 更新的菜单数据，包含要修改的字段
 *               BaseFormData类型，包含更新菜单所需的字段
 * @returns 返回Promise，解析为更新结果
 *          通常包含code(状态码)和message(提示信息)
 *
 * @example
 * // 更新ID为'123'的菜单
 * updateMenu('123', {
 *   name: '用户管理(新)',
 *   status: 0
 * })
 */
export function updateMenu(id: string, data: BaseFormData) {
  // 发送PUT请求更新菜单
  // 将ID作为路径参数，更新数据放在请求体中
  return request.put(`${API.URL}/${id}`, data); // 请求路径: /authority/menu/123
}

/**
 * 删除菜单
 * 用于从系统中删除指定的菜单项
 *
 * @param id - 要删除的菜单ID，唯一标识一个菜单项
 * @returns 返回Promise，解析为删除结果
 *          通常包含code(状态码)和message(提示信息)
 *
 * @example
 * // 删除ID为'123'的菜单
 * deleteMenu('123')
 */
export function deleteMenu(id: string) {
  // 发送DELETE请求删除菜单
  // 将ID作为路径参数
  return request.delete(`${API.URL}/${id}`); // 请求路径: /authority/menu/123
}

/**
 * 获取权限列表
 * 用于获取权限树形结构，通常用于权限分配界面
 *
 * @param data - 搜索条件，可以包含角色ID等筛选参数
 * @returns 返回Promise，解析为权限树数据和默认选中的键值
 *
 * @example
 * // 获取角色ID为'role_123'的权限列表
 * getPermission({ roleId: 'role_123' })
 */
// 定义权限结果的接口，包含树形数据和默认选中的键
interface PermissionResult {
  treeData: DataNode[]; // 树形结构数据，用于渲染权限树
  defaultCheckedKeys: Key[]; // 默认选中的节点键值，表示已有的权限
}
export function getPermission(data: object) {
  // 发送GET请求获取权限树数据
  // 将查询参数放在URL的query string中
  return request.get<PermissionResult>(`${API.URL}/tree`, { params: data }); // 请求路径: /authority/menu/tree
}

/**
 * 保存权限列表
 * 用于保存角色的权限设置，通常在权限分配界面使用
 *
 * @param data - 权限数据，通常包含角色ID和权限ID列表
 *               例如: { roleId: 'role_123', permissionIds: ['1', '2', '3'] }
 * @returns 返回Promise，解析为保存结果
 *          通常包含code(状态码)和message(提示信息)
 *
 * @example
 * // 保存角色的权限设置
 * savePermission({
 *   roleId: 'role_123',
 *   permissionIds: ['menu_1', 'menu_2', 'menu_3']
 * })
 */
export function savePermission(data: object) {
  // 发送PUT请求保存权限设置
  // 将权限数据放在请求体中
  return request.put(`${API.URL}/authorize/save`, data); // 请求路径: /authority/menu/authorize/save
}

/**
 * 获取当前用户可访问的菜单列表
 * 用于获取应用的导航菜单数据，通常在应用初始化时调用
 *
 * @returns 返回Promise，解析为菜单列表数据
 *          SideMenu[]类型，包含菜单的标签、图标、路径等信息
 *
 * @example
 * // 获取当前用户的菜单列表
 * getMenuList().then(response => {
 *   if (response.code === 200) {
 *     const menus = response.data;
 *     // 处理菜单数据...
 *   }
 * })
 */
export function getMenuList() {
  // 发送GET请求获取菜单列表
  // 注意这个API路径与其他不同，不使用API.URL前缀
  return request.get<SideMenu[]>(`/menu/list`); // 请求路径: /menu/list
}
