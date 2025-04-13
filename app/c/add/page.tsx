import {
  Box
} from '@mui/material'
import { Metadata } from 'next'
import AddCompetition from '@/app/ui/competitions/add'
import Heading from '@/app/ui/heading'

export default function Page() {
  return (
    <>
      <Box className='p-4 md:overflow-y-auto md:p-3'>
        <Heading heading={'Add Competition'} />
      </Box>
      <Box className='flex flex-col grow justify-center items-center'>
        <AddCompetition />
        <Box className='flex grow'></Box>
      </Box>
    </>
  )
}

export const metadata: Metadata = {
  title: 'Add Competition',
}
