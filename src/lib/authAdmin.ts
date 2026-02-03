import { getCurrentUserFull } from "./auth";

export async function requireAdmin() {
  const user = await getCurrentUserFull();
  if (!user || user.role !== "admin") return null;
  return user;
}
