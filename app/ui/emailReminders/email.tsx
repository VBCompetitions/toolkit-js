// import { useState } from 'react'

import { notFound } from 'next/navigation'
import { getCompetitionByUUID } from '@/app/lib/database'
import {
  Box,
  FormControlLabel,
  // SelectChangeEvent,
  Switch
} from '@mui/material'
import { EmailAccount } from '@/app/lib/definitions'
import SelectAccount from '@/app/ui/emailReminders/select-account'

export default async function Email (
  { uuid, emailAccounts }:
  {
    uuid: string,
    emailAccounts: Array<EmailAccount>
  }
) {
  const competition = await getCompetitionByUUID(uuid)
  if (!competition) {
    notFound()
  }

  // function changeAccount (e: SelectChangeEvent<string>) {
  //   // setAccount(emailAccounts.find(el => el.name === e.target.value))
  // }

  return (
    <>
      <Box className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <Box className='m-2'>
          <FormControlLabel value="start" control={<Switch /*checked={emailReminders} onChange={toggleEmailReminders}*/ color="primary" name="emailRemindersEnabled" inputProps={{ 'aria-label': 'primary checkbox' }} />} label="Enable Email Reminders" labelPlacement="start" />
        </Box>
        <Box className='m-2'>
          <SelectAccount emailAccounts={emailAccounts} />
        </Box>
      </Box>
    </>
  )
}
