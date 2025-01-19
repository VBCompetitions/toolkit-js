import { Metadata } from 'next'
import { getEmailAccountByUUID } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import UpdateAccount from '@/app/ui/emailAccounts/update'
import Heading from '@/app/ui/heading'
import {
  Box
} from '@mui/material'

export default async function Page(props: { params: Promise<{ uuid: string }> }) {
  const params = await props.params;
  const uuid = params.uuid

  const emailAccount = await getEmailAccountByUUID(uuid)
  if (!emailAccount) {
    notFound()
  }

  return (
    <Box className='mb-3'>
      <Box className='p-4 md:overflow-y-auto md:p-3'>
        <Heading heading={'Update Email Account'} />
      </Box>
      <Box className='flex flex-col grow justify-center items-center'>
        <Box className='flex grow'></Box>
          <UpdateAccount emailAccount={emailAccount} />
        <Box className='flex grow-[2]'></Box>
      </Box>
    </Box>
  )
}

export const metadata: Metadata = {
  title: 'Update Email Account',
}
