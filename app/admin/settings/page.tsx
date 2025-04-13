import { Metadata } from 'next'
import { Suspense } from 'react'
import { Box } from '@mui/material'
import Heading from '@/app/ui/heading'

export default function Page() {
  return (
    <>
      <Box className='p-4 md:overflow-y-auto md:p-3'>
        <Heading heading={'Settings'} />
      </Box>
      <Suspense>
      </Suspense>
    </>
  )
}

export const metadata: Metadata = {
  title: 'Settings',
}
