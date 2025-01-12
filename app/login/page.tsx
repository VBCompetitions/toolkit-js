import LoginForm from '@/app/ui/login/login'
import {
  Box,
  Divider,
  Typography
} from '@mui/material'

export default function LoginPage() {
  return (
    <Box className='p-1 flex flex-col grow'>
      <Box className='pt-2 pb-1 pl-2 pr-2'>
        <Box className='flex'>
          <Typography className='grow mb-1' variant='h5' textAlign='left' gutterBottom>{'\u00A0'}</Typography>
        </Box>
      </Box>
      <Box className='p-3'>
        <Divider sx={{ borderBottomWidth: 4, borderColor: '#1976d2' }} />
      </Box>
      <Box className='flex flex-col grow justify-center items-center'>
        <Box className='flex grow'></Box>
        <LoginForm />
        <Box className='flex grow-[2]'></Box>
      </Box>
    </Box>
  )
}
