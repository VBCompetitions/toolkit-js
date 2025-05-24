'use client'

import {
  useActionState,
  useState
} from 'react'

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography
} from '@mui/material'
import {
  VisibilityRounded,
  VisibilityOffRounded

} from '@mui/icons-material'

import { activateUser, ActivateUserState } from '@/app/lib/actions/users'
import { UserRecord } from '@/app/lib/definitions'

export default function ActivateUser (
  { user }:
  { user: UserRecord}
) {
  const initialState: ActivateUserState = { message: null, errors: {} }
  // eslint-disable-next-line
  const [state, formAction] = useActionState(activateUser, initialState)

  const [showPassword, setShowPassword] = useState(false)

  const [passwordToShort, setPasswordToShort] = useState(true)
  const [passwordInvalid, setPasswordInvalid] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault() }

  function passwordChange (e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordToShort(e.target.value.length < 10)
    setPasswordInvalid(!/^[a-zA-Z0-9!'#£$%&'()*+.,/:;<=>?@[^_`{|}~\-\\\]]*$/.test(e.target.value))
  }

  return (
    <Box className='p-2 flex flex-column h-full'>
      <Box className='flex flex-column items-center justify-center grow-1'>
        <Box className='grow-1' />
        <Box className='border-blue-500 border-1'>
          <form action={formAction}  aria-describedby='form-error'>
            <input className='hidden' type='text' id='uuid' name='uuid' value={user.uuid} readOnly />
            <Box className='px-2 pt-4 pb-0'>
              <Typography className='p-2' variant='body2' textAlign='center'>Make a note of your username,<br />you will need it every time you log in</Typography>
              <TextField id='username' disabled={true} name='username' sx={{ width: '35ch' }} label='Username' value={user.username} variant='outlined' />
            </Box>
            <Box className='px-2 pt-4 pb-0'>
              <Typography className='p-2' variant='body2' textAlign='center'>Enter a password for your new account<br />The password must be at least 10 characters long</Typography>
              <FormControl sx={{ width: '35ch' }} variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                <OutlinedInput
                  error={passwordInvalid}
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label='Password'
                  onChange={passwordChange}
                />
                {
                  passwordInvalid
                  ?
                  <FormHelperText className='Mui-error' id='password-error-text'>password includes invalid character</FormHelperText>
                  :
                  <FormHelperText id='password-error-text'> </FormHelperText>
                }
              </FormControl>
            </Box>
            <Box className='flex p-2'>
              <Box className='w-full flex justify-end'>
                {
                  passwordToShort
                  ?
                  <Button disabled variant='contained'>Activate Account</Button>
                  :
                  <Button type='submit' variant='contained'>Activate Account</Button>
                }
              </Box>
            </Box>
          </form>
        </Box>
        <Box className='grow-2' />
      </Box>
    </Box>
  )
}
