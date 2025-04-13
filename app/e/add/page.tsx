import {
  Box
} from '@mui/material'
import { Metadata } from 'next'
import AddAccount from '@/app/ui/emailAccounts/add'
import Heading from '@/app/ui/heading'

export default function Page() {
  return (
    <Box className='mb-3'>
      <Box className='p-4 md:overflow-y-auto md:p-3'>
        <Heading heading={'Add Email Account'} />
      </Box>
      <Box className='flex flex-col grow justify-center items-center'>
        <AddAccount />
        <Box className='flex grow-[2]'></Box>
      </Box>
    </Box>
  )
}

export const metadata: Metadata = {
  title: 'Add Email Account',
}
