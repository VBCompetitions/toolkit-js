
'use client'

import { testEmailAccount, TestEmailAccountState } from '@/app/lib/actions/email'
import {
  useActionState
} from 'react'
import {
  Box,
  Button,
  FormControl,
  Input,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import {
  SendRounded
} from '@mui/icons-material'

export default function TestAccount (
  { uuid }:
  { uuid: string }
) {
  const initialState: TestEmailAccountState = { email: '', message: '', errors: undefined }
  const [state, formAction] = useActionState(testEmailAccount, initialState)

  return (
    <Box className='flex flex-row'>
      <Box className='grow-0 md:grow' />
      <Box className='grow md:grow-0'>
        <form action={formAction}  aria-describedby='form-error'>
          <Box className='flex flex-col'>
            <FormControl>
              <Input id='uuid' name='uuid' disableUnderline={true} type='hidden' value={uuid} />
            </FormControl>
            <Box className='m-2'>
              <TextField id='email' name='email' label='To address' defaultValue={state.email} className='w-full md:w-[480px]' variant='outlined' />
            </Box>
            <Box className='mt-2 flex justify-end gap-4'>
              <Tooltip title='Send test email'><Button type='submit' variant='contained' startIcon={<SendRounded />} color='primary'>Send</Button></Tooltip>
            </Box>
            <Box className='m-2' id='status-error' aria-live='polite' aria-atomic='true'>
              {
                state.errors
                ?
                <Typography className='text-red-500'>{state.message}</Typography>
                :
                <Typography className='text-blue-500'>{state.message}</Typography>
              }
            </Box>
          </Box>
        </form>
      </Box>
      <Box className='grow-0 md:grow' />
    </Box>
  )
}
