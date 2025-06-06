'use client'
import Link from 'next/link'
import {
  useActionState,
  useState
} from 'react'

import {
  Box,
  Button,
  TextField,
  DialogContentText,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Switch,
  Tooltip,
  Typography
} from '@mui/material'
import {
  ArrowBackRounded,
  SaveAsRounded,
  VisibilityOffRounded,
  VisibilityRounded
} from '@mui/icons-material'

import { addEmailAccount, AddEmailAccountState } from '@/app/lib/actions/email'

export default function AddAccount () {
  const initialState: AddEmailAccountState = { message: null, errors: {} }
  const [state, formAction] = useActionState(addEmailAccount, initialState)

  const [accountType, setAccountType] = useState('SMTP')
  const [showPassword, setShowPassword] = useState(false)

  function clickShowPassword () {
    setShowPassword((show) => !show)
  }

  function mouseDownPassword (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
  }

  function changeAccountType (e: SelectChangeEvent<string>) {
    setAccountType(e.target.value)
  }

  const SMTPAccount = (
    <>
      <Box className='m-2'>
        <FormControlLabel control={<Switch color='primary' name='useTLS' inputProps={{ 'aria-label': 'primary checkbox' }} />} label='Use SSL/TLS (instead of STARTTLS)' labelPlacement='start' />
      </Box>
      <Box className='m-2'>
        <TextField id='host' name='hostname' label='Hostname' className='w-full md:w-[500px] m-2' variant='outlined' />
      </Box>
      <Box className='m-2'>
        <TextField id='port' name='port' label='Port' className='w-full md:w-[200px] m-2' variant='outlined' />
      </Box>
      <Box className='m-2'>
        <TextField id='username' name='username' label='Username' className='w-full md:w-[500px] m-2' variant='outlined' />
      </Box>
      <Box className='m-2'>
        <FormControl className='w-full md:w-[500px]' variant='outlined'>
          <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
          <OutlinedInput
            className='w-full'
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={clickShowPassword}
                  onMouseDown={mouseDownPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                </IconButton>
              </InputAdornment>
            }
            label='Password'
          />
        </FormControl>
      </Box>
    </>
  )

  return (
    <form action={formAction}  aria-describedby='form-error'>
      <Box className='flex flex-col'>
        <Box className='m-2'>
          <Link href='/e' className='block'>
            <IconButton size='small' aria-label='competition edit' aria-controls='competition-edit-button' aria-haspopup='true' color='inherit'>
              <ArrowBackRounded color='action' />
            </IconButton>
          </Link>
        </Box>
        <Box className='m-2'>
          <DialogContentText className='pb-5'>Email Account Configuration</DialogContentText>
        </Box>
        <Box className='m-2'>
          <TextField id='accountName' name='accountName' label='Account Name' className='w-full md:w-[500px]' variant='outlined' />
        </Box>
        <Box className='m-2'>
          <TextField id='email' name='email' label='Email Address' className='w-full md:w-[500px]' variant='outlined' />
        </Box>
        <Box className='m-2'>
          <FormControl>
            <InputLabel id='select-competition-type'>Account Type</InputLabel>
            <Select labelId='select-competition-type' id='type' className='min-w-[200px]' name='type' value={accountType} label='Account Type' onChange={changeAccountType} >
              <MenuItem value='SMTP'>{'SMTP'}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box className='border-b-4 border-blue-500' >
        </Box>

        {
          accountType === 'SMTP'
          ?
          SMTPAccount
          :
          <Typography>TODO</Typography>
        }

        <Box className='m-2' id='form-error' aria-live='polite' aria-atomic='true'>
          {state.message && state.message.length > 0 &&
          <p className='mt-2 text-sm text-red-500' key='form-error'>
            {state.message}
          </p>}
        </Box>
        <Box className='mt-6 flex justify-end gap-4'>
          <Link href='/e'>
            <Button variant='outlined' color='primary'>Cancel</Button>
          </Link>
          <Tooltip title='Save Email Account'><Button type='submit' variant='contained' startIcon={<SaveAsRounded />} color='primary'>Save</Button></Tooltip>
        </Box>
      </Box>
    </form>
  )
}
