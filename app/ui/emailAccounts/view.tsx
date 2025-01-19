import {
  Box,
  Typography
} from '@mui/material'

import { EmailAccount } from '@/app/lib/definitions'

export default function ViewAccount (
  { emailAccount }:
  { emailAccount: EmailAccount }
) {
  const smtpSettings = JSON.parse(emailAccount.data)

return (
    <Box className='flex flex-col'>
      <Box className='m-2'>
        <Box className='mr-2 inline'>
          <Typography className='text-left text-blue-500 m-2' variant='h6' component='span'>Account name:</Typography>
        </Box>
        <Typography className='text-left ml-2' variant='body1' component='span'>{emailAccount.name}</Typography>
      </Box>
      <Box className='m-2'>
        <Box className='mr-2 inline'>
          <Typography className='text-left text-blue-500' variant='h6' component='span'>Email address:</Typography>
        </Box>
        <Typography className='text-left' variant='body1' component='span'>{emailAccount.email}</Typography>
      </Box>
    </Box>
  )
}
