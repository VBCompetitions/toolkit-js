import Link from 'next/link'

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Tooltip,
  Typography
} from '@mui/material'

import type { EmailAccount } from '@/app/lib/definitions'

export default function EmailAccountCard (
  { account } :
  { account: EmailAccount }
) {

  return (
    <>
      <Box sx={{ minWidth: 200 }}>
        <Card variant='outlined' sx={{ width: 250, height: 125 }}>
          <Link href={`/e/${account.uuid}`} className='block h-full'>
            <CardActionArea className='block h-full'>
              <CardContent className='flex flex-col h-full'>
                {
                  account.name.length > 15
                  ?
                  <Tooltip title={account.name.substring(0, 150)} >
                    <Typography className='grow' variant='h5' component='div'>{account.name.substring(0, 14)}...</Typography>
                  </Tooltip>
                  :
                  <Typography className='grow' variant='h5' component='div'>{account.name}</Typography>
                }
                {
                  account.email.length > 30
                  ?
                  <Tooltip title={account.email.substring(0, 150)} >
                    <Typography className='text-left' variant='body2' component='div'>{account.email.substring(0, 29)}...</Typography>
                  </Tooltip>
                  :
                  <Typography className='text-left' variant='body2' component='div'>{account.email}</Typography>
                }
                {
                  account.type === 'SMTP'
                  ?
                  <Typography className='text-right text-blue-500' variant='body2' component='div'>[SMTP]</Typography>
                  :
                  <Typography className='text-right text-blue-500' variant='body2' component='div'>[...]</Typography>
                }
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      </Box>
    </>
  )
}
