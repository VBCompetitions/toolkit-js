import Heading from '@/app/ui/heading'
import EmailAccountList from '@/app/ui/emailAccounts/list'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { Box } from '@mui/material'

export default function Page() {
  return (
    <>
      <Box className='p-4 md:overflow-y-auto md:p-3'>
        <Heading heading={'Email Accounts'} />
      </Box>
      <Suspense>
        <EmailAccountList />
      </Suspense>
    </>
  )
}

export const metadata: Metadata = {
  title: 'Email Accounts',
}
