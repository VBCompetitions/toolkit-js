import { Metadata } from 'next'
import { Box } from '@mui/material'
import Heading from '@/app/ui/heading'
import AddUser from '@/app/ui/users/add'
import { auth } from '@/auth'
import RBAC, { Roles } from '@/app/lib/rbac'

import { InsufficientRoles } from '@/app/ui/home/insufficientRoles'
import { getUsers } from '@/app/lib/database'

export default async function Page() {
  const session = await auth()

  if (!session) {
    // TODO, this should force a logout
    return (
      <InsufficientRoles />
    )
  }

  if (!await RBAC.roleCheck(session?.user, [Roles.ADMIN])) {
    return (
      <InsufficientRoles />
    )
  }

  const usernames: Array<string> = (await getUsers(session)).map(user => user.username)

  return (
    <>
      <Box className='p-4 md:overflow-y-auto md:p-3'>
        <Heading heading={'New User'} />
      </Box>
      <Box className='flex flex-col grow justify-center items-center'>
        <AddUser usernames={usernames} />
        <Box className='flex grow'></Box>
      </Box>
    </>
  )
}

export const metadata: Metadata = {
  title: 'New User',
}
