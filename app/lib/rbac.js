import { getUserByUUID } from "./database"

export default class RBAC {
  static async roleCheck (user, role) {
    if (!user) {
      return false
    }
    const userInfo = await getUserByUUID(user.id)
    return userInfo.state === 'active' && userInfo.roles.includes(role)
  }
}

export const Roles = {
  ADMIN: 'ADMIN',
  TREASURER: 'TREASURER',
  FIXTURES: 'FIXTURES'
}
