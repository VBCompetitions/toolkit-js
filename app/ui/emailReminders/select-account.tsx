'use client'
import { useState } from 'react'

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { EmailAccount } from '@/app/lib/definitions'

export default function SelectAccount (
  { emailAccounts }:
  { emailAccounts: Array<EmailAccount> }
) {
  const [account, setAccount] = useState<EmailAccount|undefined>()

  function changeAccount (e: SelectChangeEvent<string>) {
    setAccount(emailAccounts.find(el => el.name === e.target.value))
  }

  return (
    <FormControl>
      <InputLabel id='select-account'>Email Account</InputLabel>
      <Select labelId='select-account' id='type' className='min-w-[200px]' name='type' value={account ? account.name : ''} label='Email Account' onChange={changeAccount} >
        {
          emailAccounts.sort((a, b) => {
            return a.name.localeCompare(b.name)
          }).map(emailAccount => (
            <MenuItem key={emailAccount.uuid} value={emailAccount.name}>{emailAccount.name}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )
}
