import { Box, Typography } from "@mui/material";

export function InsufficientRoles () {
  return (
    <Box className='flex flex-col justify-center items-center grow p-3'>
      <Box className='grow'></Box>
      <Box className='border-blue-500 border-solid border-[1px] rounded-md'>
        <Box className='bg-blue-500 text-white px-3 py-5'>
          <Typography className='grow-1 mb-1' variant='h5' textAlign='left'>Permission Denied</Typography>
        </Box>
        <Box className='flex border-0 px-3 py-5'>
          You do not have sufficient permission to see this page
        </Box>
      </Box>
      <Box className='grow-2'></Box>
    </Box>
  )
}
