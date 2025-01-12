import {
  Box,
  Divider,
  Typography
} from '@mui/material'

export default async function Heading ({ heading }: { heading: string }) {
  return (
    <Box className='flex flex-col'>
      <Box className='pt-2 pb-1'>
        <Typography className='text-blue-500' variant={'h5'}>{heading}</Typography>
      </Box>
      <Box className='pt-1 pb-1' paddingBottom={'20px'}>
        <Divider sx={{ borderBottomWidth: 4, borderColor: '#1976d2' }} />
      </Box>
    </Box>
  )
}
