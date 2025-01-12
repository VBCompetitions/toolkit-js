import Heading from '@/app/ui/heading'
import CompetitionList from '@/app/ui/competitions/list'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { Box } from '@mui/material'

export default function Page() {
  return (
    <>
      <Box className='p-4 md:overflow-y-auto md:p-3'>
        <Heading heading={'Competitions'} />
      </Box>
      <Suspense>
        <CompetitionList />
      </Suspense>
    </>
  )
}

export const metadata: Metadata = {
  title: 'Competitions Dashboard',
}
