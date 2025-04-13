import { Metadata } from 'next'
import { Suspense } from 'react'
import { Box } from '@mui/material'
import Heading from '@/app/ui/heading'
import AddUser from '@/app/ui/users/add'
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

  return (
    <>
      <Box className='p-4 md:overflow-y-auto md:p-3'>
        <Heading heading={'New User'} />
      </Box>
      <Box className='flex flex-col grow justify-center items-center'>
        <AddUser />
        <Box className='flex grow'></Box>
      </Box>
    </>
  )
}

export const metadata: Metadata = {
  title: 'New User',
}
