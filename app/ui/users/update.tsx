'use client'
import Link from 'next/link'
import {
  useActionState,
  useState
} from 'react'

import {
  Box,
  Button,
  Checkbox,
  DialogContentText,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import {
  ArrowBackRounded,
  SaveAsRounded
} from '@mui/icons-material'

import { updateUser, UpdateUserState } from '@/app/lib/actions/users'
import { UserRecord } from '@/app/lib/definitions'
import { Roles } from '@/app/lib/rbac'

export default function UpdateUser (
  { user }:
  { user: UserRecord}
) {

  const initialState: UpdateUserState = { message: null }
  const [state, formAction] = useActionState(updateUser, initialState)
  const [userState, setUserState] = useState(user.state)

  function toggleState () {
    if (userState === 'active') {
      setUserState('suspended')
    } else if (userState === 'suspended') {
      setUserState('active')
    }
  }

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
        <input type='hidden' name='uuid' value={user.uuid} />
        <Box className='my-3 grid grid-col'>
          <TextField autoFocus disabled={true} margin='dense' id='username' name='username' label='username' defaultValue={user ? user.username : ''} type='text' fullWidth/>
        </Box>
        <Box className='my-3 grid grid-col'>
          <Switch name='state' onClick={toggleState} disabled={userState === 'pending'} checked={userState === 'active'} ></Switch>
          <Typography variant='body2' component='span' className={userState === 'active' ? 'text-green-700' : userState === 'suspended' ? 'text-red-500' : 'text-blue-500' }>{userState}</Typography>
        </Box>
        <Box className='my-3 grid grid-col'>
          <DialogContentText>Roles</DialogContentText>
          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked={user.roles.includes('ADMIN')} name={Roles.ADMIN} />} label='ADMIN' />
            <FormControlLabel control={<Checkbox defaultChecked={user.roles.includes('FIXTURES')} name={Roles.FIXTURES} />} label='FIXTURES' />
            <FormControlLabel control={<Checkbox defaultChecked={user.roles.includes('TREASURER')} name={Roles.TREASURER} />} label='TREASURER' />
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
          <Tooltip title='Update User'><Button type='submit' variant='contained' startIcon={<SaveAsRounded />} color='primary'>Update</Button></Tooltip>
        </Box>
      </form>
      <Box className='grow'></Box>
    </Box>
  )
}
