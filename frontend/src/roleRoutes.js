export function getRoleHome(role) {
  if (role === "hr") return "/hr";
  if (role === "manager") return "/manager";
  return "/my-leaves";
}
