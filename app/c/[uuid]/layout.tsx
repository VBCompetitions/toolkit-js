import '@/app/ui/global.css'
import { Metadata } from 'next'
import { Box } from '@mui/material'
import CompetitionNav from '@/app/ui/competitions/nav'

export default async function Layout(
  { params, children }:
  {
    params: Promise<{ uuid: string }>
    children: React.ReactNode
  }
) {
  const paramss = await params;
  const uuid = paramss.uuid

  return (
    <Box className='p-1 flex flex-col md:flex-row md:overflow-hidden grow'>
      <Box className="w-full flex-none md:w-64">
        <CompetitionNav uuid={uuid}/>
      </Box>
      <Box className="flex-grow p-6 md:overflow-y-auto md:p-8">
        {children}
      </Box>
    </Box>
  )
}

export const metadata: Metadata = {
  title: {
    template: '%s | VBC Toolkit',
    default: 'VBC Toolkit',
  },
  description: 'A bag of tools for working with VBCompetition competitions'
}
