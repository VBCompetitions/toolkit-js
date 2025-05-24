import { getUserByUUID } from "./database"
import { logout } from '@/app/lib/actions/auth'

export default class RBAC {
  static async activeCheck (user) {
    if (!user) {
      return false
    }
    const userInfo = await getUserByUUID(user.id)
    return userInfo.state === 'active'
  }

  static async forceLogout () {
    await logout()
  }

  static async roleCheck (user, roles) {
    if (!user) {
      return false
    }
    const userInfo = await getUserByUUID(user.id)
    return userInfo.roles.filter(value => roles.includes(value)).length > 0
  }
}

export const Roles = {
  ADMIN: 'ADMIN',
  TREASURER: 'TREASURER',
  FIXTURES: 'FIXTURES'
}
