'use client'

import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography
} from '@mui/material'
import {
  VisibilityOffRounded,
  VisibilityRounded
} from '@mui/icons-material'

import { useActionState, useState } from 'react'
import { authenticate } from '@/app/lib/actions/auth'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [usernameToShort, setUsernameToShort] = useState(true)
  const [passwordToShort, setPasswordToShort] = useState(true)

  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  )

  const clickShowPassword = () => setShowPassword((show) => !show)

  const mouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault() }

  function passwordChange (e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordToShort(e === null || e.target.value?.length < 1)
  }

  function usernameChange (e: React.ChangeEvent<HTMLInputElement>) {
    setUsernameToShort(e.target.value.length < 1)
  }

  return (
    <Box className='border border-blue-500 rounded-md flex flex-col'>
      <Box className='bg-blue-500 p-5 text-white'>
        <Typography className='grow mb-0' variant='h5' textAlign='center'>VBCToolkit</Typography>
      </Box>
      <form action={formAction}>
        <Box className='pt-5 pb-0 pr-4 pl-4'>
          <TextField className='w-full' id='username' name='username' label='Username' variant='outlined' onChange={usernameChange} />
        </Box>
        <Box className='pt-5 pb-0 pr-4 pl-4'>
          <FormControl className='m-1'  sx={{ width: '35ch' }} variant='outlined'>
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
              onChange={passwordChange}
            />
          </FormControl>
        </Box>
        <Box className='flex pt-4 p-3'>
          <Box className='grow'></Box>
          <Box>
            <Button type='submit' variant='contained' aria-disabled={isPending} disabled={ isPending || usernameToShort || passwordToShort }>Log in</Button>
          </Box>
        </Box>
      </form>
      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage && (
          <>
            {/* <ExclamationCircleIcon className="h-5 w-5 text-red-500" /> */}
            <p className="text-sm text-red-500">{errorMessage}</p>
          </>
        )}
      </div>
    </Box>
  )
}
