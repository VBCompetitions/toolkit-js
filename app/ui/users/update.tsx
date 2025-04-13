'use client'
import Link from 'next/link'
import {
  useActionState
} from 'react'

import {
  Box,
  Button,
  Checkbox,
  DialogContentText,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material'
import {
  ArrowBackRounded,
  SaveAsRounded
} from '@mui/icons-material'

import { addUser, AddUserState } from '@/app/lib/actions/users'
import { UserRecord } from '@/app/lib/definitions'

export default function UpdateUser (
  { user }:
  { user: UserRecord}
) {
  const initialState: AddUserState = { message: null, errors: {} }
  const [state, formAction] = useActionState(addUser, initialState)

  return (
    <Box className='flex flex-col w-64 sm:w-96 md:w-3/4 lg:w-1/2'>
      <Box className='m-2'>
        <Link href='/admin/users' className='block'>
          <IconButton size='small' aria-label='competition edit' aria-controls='competition-edit-button' aria-haspopup='true' color='inherit'>
            <ArrowBackRounded color='action' />
          </IconButton>
        </Link>
      </Box>
      <form action={formAction}  aria-describedby='form-error'>
        <Box className='my-3 grid grid-col'>
          <DialogContentText>User</DialogContentText>
          <TextField autoFocus margin='dense' id='username' name='username' label='username' type='text' fullWidth/>
        </Box>
        <Box className='my-3 grid grid-col'>
          <DialogContentText>Roles</DialogContentText>
          <FormGroup>
            <FormControlLabel control={<Checkbox name='ADMIN' />} label='ADMIN' />
            <FormControlLabel control={<Checkbox name='FIXTURES' />} label='FIXTURES' />
            <FormControlLabel control={<Checkbox name='TREASURER' />} label='TREASURER' />
          </FormGroup>
        </Box>
        <Box id='form-error' aria-live='polite' aria-atomic='true'>
          {state.message && state.message.length > 0 &&
          <p className='mt-2 text-sm text-red-500' key='form-error'>
            {state.message}
          </p>}
        </Box>
        <Box className='mt-6 flex justify-end gap-4'>
          <Link href='/admin/users'>
            <Button variant='outlined' color='primary'>Cancel</Button>
          </Link>
          <Tooltip title='Add User'><Button type='submit' variant='contained' startIcon={<SaveAsRounded />} color='primary'>Create</Button></Tooltip>
        </Box>
      </form>
      <Box className='grow'></Box>
    </Box>
  )
}
