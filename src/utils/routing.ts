/**
 * 路由工具函数
 */

/**
 * 从路径名解析当前路由
 * @param pathname - 当前位置的路径名
 * @returns 路由名称（例如：'dashboard'、'transactions'）
 */
export function getActiveRoute(pathname: string): string {
  return pathname === "/" ? "dashboard" : pathname.slice(1);
}
