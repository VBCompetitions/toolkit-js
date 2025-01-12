import Link from 'next/link'

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Tooltip,
  Typography
} from '@mui/material'

import type { Competition } from '@/app/lib/definitions'

export default function CompetitionCard (
  { competition } :
  { competition: Competition }
) {
  return (
    <>
      <Box sx={{ minWidth: 200 }}>
        <Card variant='outlined' sx={{ width: 250, height: 125 }}>
          <Link href={`/c/${competition.uuid}`} className='block h-full'>
            <CardActionArea className='block h-full'>
              <CardContent className='flex flex-col h-full'>
                {
                  competition.name.length > 50
                  ?
                  <Tooltip title={competition.name.substring(0, 150)} >
                    <Typography className='grow' variant='h5' component='div'>{competition.name.substring(0, 49)}...</Typography>
                  </Tooltip>
                  :
                  <Typography className='grow' variant='h5' component='div'>{competition.name}</Typography>
                }
                {
                  competition.type === 'url'
                  ?
                  <Typography className='text-right text-blue-500' variant='body2' component='div'>[URL linked]</Typography>
                  :
                  <Typography className='text-right text-blue-500' variant='body2' component='div'>[local download]</Typography>
                }
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      </Box>
    </>
  )
}
