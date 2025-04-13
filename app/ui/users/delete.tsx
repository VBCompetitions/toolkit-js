import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { deleteUser as actionDeleteUser } from '@/app/lib/actions/users'
import type { UserRecord } from '@/app/lib/definitions'

function DeleteUser (
  { user, closeDialog } :
  {
    user: UserRecord,
    closeDialog: () => void
  }
) {
  const deleteUser = () => {
    closeDialog()
    actionDeleteUser(user.uuid)
  }

  return (
    <Dialog open={true} onClose={closeDialog} aria-labelledby="delete user">
      <DialogTitle id="delete-user-dialog-title">Delete user</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete the user?</DialogContentText>
        <DialogContentText>Name: {user.username}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} variant="outlined" color="primary">Cancel</Button>
        <form action={deleteUser}>
          <Button type='submit' variant="contained" color="primary">Delete</Button>
        </form>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteUser
