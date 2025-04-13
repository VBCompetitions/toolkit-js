'use client'

import Link from 'next/link'
import { useState } from 'react'

import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import {
  DeleteRounded,
  EditRounded
} from '@mui/icons-material'
import DeleteEmailAccount from '@/app/ui/emailAccounts/deleteAccount'
import type { EmailAccountMetadata } from '@/app/lib/definitions'

export default function EmailAccountCard (
  { account } :
  { account: EmailAccountMetadata }
) {
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)

  const openDeleteAccount = () => {
    setDeleteAccountOpen(true)
  }

  const closeDeleteAccount = () => {
    setDeleteAccountOpen(false)
  }

  let type = ''
  if (account.type === 'SMTP') {
    type = 'SMTP'
  } else {
    type = 'unknown'
  }

  return (
    <>
      <Box sx={{ minWidth: 200 }}>
        <Card variant='outlined' sx={{ width: 250 }}>
          <CardActionArea>
            <Link href={`/e/${account.uuid}`} className='block'>
              <CardContent className='flex flex-col'>
                <Box>
                  {
                    account.name.length > 15
                    ?
                    <Tooltip title={account.name.substring(0, 150)} >
                      <Typography variant='h5' component='div'>{account.name.substring(0, 14)}...</Typography>
                    </Tooltip>
                    :
                    <Typography variant='h5' component='div'>{account.name}</Typography>
                  }
                  <Typography className='text-left text-blue-500' variant='body2' component='div'>[{type}]</Typography>
                </Box>
                {
                  account.email.length > 30
                  ?
                  <Tooltip title={account.email.substring(0, 150)} >
                    <Typography className='text-left' variant='body2' component='div'>{account.email.substring(0, 29)}...</Typography>
                  </Tooltip>
                  :
                  <Typography className='text-left' variant='body2' component='div'>{account.email}</Typography>
                }
              </CardContent>
            </Link>
          </CardActionArea>
          <CardActions sx={{ paddingTop: '0px' }}>
            <Box className='flex grow justify-end'>
              <Box className='px-2'>
                <Link href={`/e/${account.uuid}/update`} className='block'>
                  <IconButton size='small' aria-label='competition edit' aria-controls='competition-edit-button' aria-haspopup='true' color='inherit'>
                    <EditRounded color='action' />
                  </IconButton>
                </Link>
              </Box>
              <IconButton size='small' aria-label='account delete' aria-controls='account-button' aria-haspopup='true' color='inherit'>
                <DeleteRounded onClick={openDeleteAccount} color='action' />
              </IconButton>
            </Box>
          </CardActions>
        </Card>
      </Box>
      { deleteAccountOpen ? <DeleteEmailAccount account={account} closeDialog={closeDeleteAccount} /> : null }
    </>
  )
}
