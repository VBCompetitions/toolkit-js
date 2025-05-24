// import { useState } from 'react'

import { notFound } from 'next/navigation'
import { getCompetitionByUUID } from '@/app/lib/database'
import {
  Box,
  FormControlLabel,
  // SelectChangeEvent,
  Switch
} from '@mui/material'
import { EmailAccountMetadata } from '@/app/lib/definitions'
import SelectAccount from '@/app/ui/emailReminders/select-account'
import RBAC, { Roles } from '@/app/lib/rbac'
import { auth } from '@/auth'
import { InsufficientRoles } from '../home/insufficientRoles'

export default async function Email (
  { uuid, emailAccounts }:
  {
    uuid: string,
    emailAccounts: Array<EmailAccountMetadata>
  }
) {
  const session = await auth()

  if (!session) {
    // TODO, this should force a logout
    return (
      <InsufficientRoles />
    )
  }

  if (!await RBAC.roleCheck(session?.user, [Roles.ADMIN])) {
    return (
      <InsufficientRoles />
    )
  }

  const competition = await getCompetitionByUUID(uuid, session)
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
