import { Metadata } from 'next'
import { getUserByUUID } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import ActivateUser from '@/app/ui/users/activate'
import Heading from '@/app/ui/heading'
import {
  Box
} from '@mui/material'
import { auth } from '@/auth'

export default async function Page(props: { params: Promise<{ uuid: string }> }) {
  const params = await props.params;
  const uuid = params.uuid
  const session = await auth()

  if (!session) {
    // TODO, this should force a logout
    return
  }

  const user = await getUserByUUID(uuid, session)
  if (!user) {
    notFound()
  }

  return (
    <Box className='mb-3'>
      <Box className='p-4 md:overflow-y-auto md:p-3'>
        <Heading heading={'Activate User Account'} />
      </Box>
      <Box className='flex flex-col grow justify-center items-center'>
        <Box className='flex grow'></Box>
          <ActivateUser user={user} />
        <Box className='flex grow-[2]'></Box>
      </Box>
    </Box>
  )
}

export const metadata: Metadata = {
  title: 'Activate Account',
}
