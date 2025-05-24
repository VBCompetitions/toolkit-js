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
  TextField,
  Tooltip
} from '@mui/material'
import {
  ArrowBackRounded,
  SaveAsRounded
} from '@mui/icons-material'

import { addUser, AddUserState } from '@/app/lib/actions/users'
import { Roles } from '@/app/lib/rbac'

export default function AddUser (
  { usernames }:
  { usernames: Array<string> }
) {

  const initialState: AddUserState = { message: null }
  const [state, formAction] = useActionState(addUser, initialState)
  const [usernameBadLength, setUsernameBadLength] = useState(false)
  const [usernameExists, setUsernameExists] = useState(false)
  const [usernameInvalid, setUsernameInvalid] = useState(false)

  const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 0 || e.target.value.length > 50) {
      setUsernameBadLength(true)
      setUsernameExists(false)
      setUsernameInvalid(false)
    } else if (usernames.includes(e.target.value)) {
      setUsernameBadLength(false)
      setUsernameExists(true)
      setUsernameInvalid(false)
    } else if (!/^((?![":{}?= ])[\x20-\x7F])+$/.test(e.target.value)) {
      setUsernameBadLength(false)
      setUsernameExists(false)
      setUsernameInvalid(true)
    } else {
      setUsernameBadLength(false)
      setUsernameExists(false)
      setUsernameInvalid(false)
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
        <Box className='my-3 grid grid-col'>
          {
            usernameExists
            ?
            <TextField error helperText='user already exists' margin='dense' id='username' name='username' onChange={changeUsername} label='username' type='text' fullWidth/>
            :
              usernameInvalid
              ?
              <TextField error helperText='invalid username' margin='dense' id='username'name='username'  onChange={changeUsername} label='username' type='text' fullWidth/>
              :
                usernameBadLength
                ?
                <TextField error helperText='username must be between 1 and 50 characters' margin='dense' id='username' name='username' onChange={changeUsername} label='username' type='text' fullWidth/>
                :
                <TextField autoFocus helperText='&nbsp;' margin='dense' id='username' name='username' onChange={changeUsername} label='username' type='text' fullWidth/>
          }
        </Box>
        <Box className='my-3 grid grid-col'>
          <DialogContentText>Roles</DialogContentText>
          <FormGroup>
            <FormControlLabel control={<Checkbox name={Roles.ADMIN} />} label='ADMIN' />
            <FormControlLabel control={<Checkbox name={Roles.FIXTURES} />} label='FIXTURES' />
            <FormControlLabel control={<Checkbox name={Roles.TREASURER} />} label='TREASURER' />
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
          <Tooltip title='Add User'>
            <Button disabled={usernameBadLength || usernameExists || usernameInvalid} type='submit' variant='contained' startIcon={<SaveAsRounded />} color='primary'>Create</Button>
          </Tooltip>
        </Box>
      </form>
      <Box className='grow'></Box>
    </Box>
  )
}
