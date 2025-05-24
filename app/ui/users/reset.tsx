import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { resetUser as actionResetUser } from '@/app/lib/actions/users'
import type { UserRecord } from '@/app/lib/definitions'

function ResetUser (
  { user, closeDialog } :
  {
    user: UserRecord,
    closeDialog: () => void
  }
) {
  const resetUser = () => {
    closeDialog()
    actionResetUser(user.uuid)
  }

  return (
    <Dialog open={true} onClose={closeDialog} aria-labelledby="reset user">
      <DialogTitle id="reset-user-dialog-title">Reset user</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to reset the user?</DialogContentText>
        <DialogContentText>Username: {user.username}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} variant="outlined" color="primary">Cancel</Button>
        <form action={resetUser}>
          <Button type='submit' variant="contained" color="primary">Reset</Button>
        </form>
      </DialogActions>
    </Dialog>
  )
}

export default ResetUser
