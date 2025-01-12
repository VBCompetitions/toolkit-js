import {
  Box,
  Divider,
  Typography
} from '@mui/material'

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent';

export default function CompetitionSkeleton () {
  return (
    <Box className='flex flex-col'>
      <Box className='pt-2 pb-1'>
        <Typography className={`${shimmer} relative overflow-hidden bg-gray-100 shadow-sm`} variant={'h5'}> </Typography>
      </Box>
      <Box className='pt-1 pb-1'>
        <Divider sx={{ borderBottomWidth: 4, borderColor: '#1976d2' }} />
      </Box>
      <Box className='h-5 w-full' />
      <Box className={`${shimmer} h-32 relative overflow-hidden bg-gray-100 shadow-sm`} />
    </Box>
  )
}
