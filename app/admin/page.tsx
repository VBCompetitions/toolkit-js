import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import RBAC, { Roles } from '@/app/lib/rbac'
import { InsufficientRoles } from '@/app/ui/home/insufficientRoles'

export default async function Page() {
  const session = await auth()

  if (!await RBAC.roleCheck(session?.user, Roles.ADMIN)) {
    return (
      <InsufficientRoles />
    )
  }

  redirect('/admin/settings')
}

