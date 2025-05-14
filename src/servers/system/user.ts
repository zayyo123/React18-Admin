/**
 * servers/system/user.ts
 *
 * 这个文件提供了与用户管理相关的API请求函数。
 * 主要功能包括：
 * 1. 用户的增删改查操作
 * 2. 批量删除用户
 * 3. 获取用户详情
 *
 * 所有函数都使用统一的request实例发送请求，确保请求格式和错误处理的一致性。
 */

// 导入封装好的请求工具
import { request } from "@/utils/request";

/**
 * API路径枚举
 * 集中管理API路径，便于维护和修改
 */
enum API {
  URL = "/authority/user", // 用户相关API的基础路径
}

/**
 * 获取用户分页数据
 * 用于获取用户列表的分页数据，支持筛选和排序
 *
 * @param data - 请求参数，包含分页信息和筛选条件
 *               Partial<BaseFormData>表示可以包含表单数据的部分字段
 *               PaginationData包含页码、每页条数等分页信息
 * @returns 返回Promise，解析为包含用户列表和总数的分页结果
 *          PageServerResult<BaseFormData[]>类型，包含items(数据列表)和total(总数)
 *
 * @example
 * // 获取第一页，每页10条数据
 * getUserPage({ page: 1, pageSize: 10 })
 * // 带筛选条件的查询
 * getUserPage({ page: 1, pageSize: 10, status: 1, keyword: 'admin' })
 */
export function getUserPage(data: Partial<BaseFormData> & PaginationData) {
  // 发送GET请求获取分页数据
  // 将查询参数放在URL的query string中
  return request.get<PageServerResult<BaseFormData[]>>(`${API.URL}/page`, {
    params: data, // 请求参数，会被转换为query string
  });
}

/**
 * 根据ID获取用户详情
 * 用于获取单个用户的详细信息，通常用于编辑前的数据获取
 *
 * @param id - 用户ID，唯一标识一个用户
 * @returns 返回Promise，解析为用户详情数据
 *          BaseFormData类型，包含用户的所有字段
 *
 * @example
 * // 获取ID为'123'的用户详情
 * getUserById('123')
 */
export function getUserById(id: string) {
  // 发送GET请求获取详情数据
  // 将ID作为query参数传递
  return request.get<BaseFormData>(`${API.URL}/detail?id=${id}`); // 请求路径: /authority/user/detail?id=xxx
}

/**
 * 创建新用户
 * 用于添加新的用户到系统中
 *
 * @param data - 用户数据，包含用户的用户名、真实姓名、角色等信息
 *               BaseFormData类型，包含创建用户所需的所有字段
 * @returns 返回Promise，解析为创建结果
 *          通常包含code(状态码)和message(提示信息)
 *
 * @example
 * // 创建一个新用户
 * createUser({
 *   username: 'john_doe',
 *   real_name: 'John Doe',
 *   roles_name: 'editor',
 *   status: 1
 * })
 */
export function createUser(data: BaseFormData) {
  // 发送POST请求创建用户
  // 将用户数据放在请求体中
  return request.post(API.URL, data); // 请求路径: /authority/user
}

/**
 * 更新用户信息
 * 用于修改现有用户的信息
 *
 * @param id - 要修改的用户ID，唯一标识一个用户
 * @param data - 更新的用户数据，包含要修改的字段
 *               BaseFormData类型，包含更新用户所需的字段
 * @returns 返回Promise，解析为更新结果
 *          通常包含code(状态码)和message(提示信息)
 *
 * @example
 * // 更新ID为'123'的用户
 * updateUser('123', {
 *   real_name: 'John Doe Jr.',
 *   status: 0
 * })
 */
export function updateUser(id: string, data: BaseFormData) {
  // 发送PUT请求更新用户
  // 将ID作为路径参数，更新数据放在请求体中
  return request.put(`${API.URL}/${id}`, data); // 请求路径: /authority/user/123
}

/**
 * 删除用户
 * 用于从系统中删除指定的用户
 *
 * @param id - 要删除的用户ID，唯一标识一个用户
 * @returns 返回Promise，解析为删除结果
 *          通常包含code(状态码)和message(提示信息)
 *
 * @example
 * // 删除ID为'123'的用户
 * deleteUser('123')
 */
export function deleteUser(id: string) {
  // 发送DELETE请求删除用户
  // 将ID作为路径参数
  return request.delete(`${API.URL}/${id}`); // 请求路径: /authority/user/123
}

/**
 * 批量删除用户
 * 用于一次性删除多个用户，通常用于表格中的批量操作
 *
 * @param data - 包含要删除的用户ID列表，通常格式为 { ids: string[] }
 *               BaseFormData类型，但实际上只需要包含ids字段
 * @returns 返回Promise，解析为批量删除结果
 *          通常包含code(状态码)和message(提示信息)
 *
 * @example
 * // 批量删除多个用户
 * batchDeleteUser({ ids: ['123', '456', '789'] })
 */
export function batchDeleteUser(data: BaseFormData) {
  // 发送POST请求批量删除用户
  // 将要删除的ID列表放在请求体中
  return request.post(`${API.URL}/batchDelete`, data); // 请求路径: /authority/user/batchDelete
}
