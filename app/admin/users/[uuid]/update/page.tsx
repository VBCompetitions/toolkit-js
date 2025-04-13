import { Metadata } from 'next'
import { getUserByUUID } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import UpdateUser from '@/app/ui/users/update'
import Heading from '@/app/ui/heading'
import {
  Box
} from '@mui/material'
import { auth } from '@/auth'
import RBAC, { Roles } from '@/app/lib/rbac'
import { InsufficientRoles } from '@/app/ui/home/insufficientRoles'

export default async function Page(props: { params: Promise<{ uuid: string }> }) {
  const session = await auth()

  if (!await RBAC.roleCheck(session?.user, Roles.ADMIN)) {
    return (
      <InsufficientRoles />
    )
  }

  const params = await props.params;
  const uuid = params.uuid

  const user = await getUserByUUID(uuid)
  if (!user) {
    notFound()
  }

  return (
    <Box className='mb-3'>
      <Box className='p-4 md:overflow-y-auto md:p-3'>
        <Heading heading={'Update User'} />
      </Box>
      <Box className='flex flex-col grow justify-center items-center'>
        <Box className='flex grow'></Box>
          <UpdateUser user={user} />
        <Box className='flex grow-[2]'></Box>
      </Box>
    </Box>
  )
}

export const metadata: Metadata = {
  title: 'Update User Account',
}
