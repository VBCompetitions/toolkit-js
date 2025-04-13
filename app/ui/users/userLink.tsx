import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import type { UserRecord } from '@/app/lib/definitions'

export default function UserLink (
  { user, closeDialog } :
  {
    user: UserRecord,
    closeDialog: () => void
  }
) {
  async function userLinkCopy () {
    const activationInfo = `Username:\n${user ? user.username : ''}\nActivation Link:\n${user ? `${window.location.href.replace('/admin/users', '/account/')}${user.uuid}` : ''}`
    await navigator.clipboard.writeText(activationInfo)
  }

  return (
    <Dialog open={true} onClose={closeDialog} aria-labelledby='user link'>
      <DialogTitle id='user-link-dialog-title' className='dialog-top'>User Activation Link</DialogTitle>
      <DialogContent>
        <Box sx={{padding: '10px 0px'}}>
          <Typography variant='body1' >Copy the information below and send it to the new user.  They can then<br/>activate their account and set their own password</Typography>
        </Box>
        <Box className='data-box' >
          <Box sx={{padding: '10px'}}>
            <Typography variant='body1' >Username:</Typography>
            <Typography variant='body2' >{user ? user.username : ''}</Typography>
          </Box>
          <Box sx={{padding: '10px'}}>
            <Typography variant='body1' >Activation Link:</Typography>
            <Typography variant='body2' >{user ? `${window.location.href.replace('/admin/users', '/account/')}${user.uuid}` : ''}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', padding: '10px 0px 0px 0px'}}>
          <Button aria-label='Copy' variant='outlined' startIcon={<ContentCopyRounded />} onClick={userLinkCopy}>Copy Info</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} variant='contained' color='primary'>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
