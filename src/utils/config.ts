/* src\utils\config.ts 是项目的配置文件，它定义了应用中使用的各种常量和配置项。这些配置包括：

1.应用的基本信息（标题后缀、水印前缀等）
2.存储相关的键名（token、语言、版本等）
3.默认值和格式化规则（空值显示、日期格式等）
4.表单验证规则（必填项、密码规则等）
5.环境相关配置（API地址等） */

// 导入 i18next 的 TFunction 类型，用于国际化翻译函数的类型定义
import type { TFunction } from "i18next";

/**
 * @description: 配置项
 * 这个文件包含了应用的各种配置常量
 */

// 定义应用标题后缀，使用国际化翻译函数获取当前语言的应用名称
export const TITLE_SUFFIX = (t: TFunction) => t("public.currentName"); // 标题后缀

// 定义水印前缀，用于页面水印显示
export const WATERMARK_PREFIX = "admin"; // 水印前缀

// 定义 token 在本地存储中的键名
export const TOKEN = "admin_token"; // token名称

// 定义语言设置在本地存储中的键名
export const LANG = "lang"; // 语言

// 定义版本信息在本地存储中的键名
export const VERSION = "admin_version"; // 版本

// 定义空值的显示文本，当数据为空时显示的占位符
export const EMPTY_VALUE = "-"; // 空值显示

// 定义主题设置在本地存储中的键名
export const THEME_KEY = "theme_key"; // 主题

// 定义分页的初始配置，包括当前页码和每页显示数量
export const INIT_PAGINATION = {
  page: 1, // 初始页码为第1页
  pageSize: 20, // 每页显示20条数据
};

// 定义日期格式化的标准格式
export const DATE_FORMAT = "YYYY-MM-DD"; // 日期格式化

// 定义时间格式化的标准格式，包含日期和时间
export const TIME_FORMAT = "YYYY-MM-DD hh:mm:ss"; // 时间格式化

// 定义表单必填项的验证规则，用于 Ant Design 表单组件
export const FORM_REQUIRED = [{ required: true }]; // 表单必填校验

// 定义新增标题的格式化函数，使用国际化翻译
// t: 翻译函数，title: 可选的标题参数
export const ADD_TITLE = (t: TFunction, title?: string) =>
  t("public.createTitle", { title: title ?? "" }); // 新增标题

// 定义编辑标题的格式化函数，使用国际化翻译
// t: 翻译函数，name: 被编辑项的名称，title: 可选的标题参数
export const EDIT_TITLE = (t: TFunction, name: string, title?: string) =>
  `${t("public.editTitle", { title: title ?? "" })}${name ? `(${name})` : ""}`; // 编辑标题

// 定义密码规则的验证函数，返回包含正则表达式和错误消息的对象
// 密码规则：必须包含数字和字母，可以包含特殊字符，长度6-30位
export const PASSWORD_RULE = (t: TFunction) => ({
  pattern: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*+\.\_\-*]{6,30}$/,
  message: t("login.passwordRuleMessage"), // 使用国际化翻译的错误消息
});

// 获取当前环境变量，用于判断开发环境还是生产环境
const ENV = import.meta.env.VITE_ENV as string;

// 获取基础 URL 环境变量，用于 API 请求
const URL = import.meta.env.VITE_BASE_URL as string;

// 定义文件上传 API 地址
// 在开发环境使用代理前缀 "/api"，在生产环境使用完整的 URL
export const FILE_API = `${
  ENV === "development" ? "/api" : URL
}/authority/file/upload-file`; // 上传地址
