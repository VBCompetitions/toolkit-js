import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { deleteEmailAccount as actionDeleteEmailAccount } from '@/app/lib/actions/email'
import type { EmailAccountMetadata } from '@/app/lib/definitions'

function DeleteEmailAccount (
  { account, closeDialog } :
  {
    account: EmailAccountMetadata,
    closeDialog: () => void
  }
) {
  const deleteEmailAccount = () => {
    closeDialog()
    actionDeleteEmailAccount(account.uuid)
  }

  return (
    <Dialog open={true} onClose={closeDialog} aria-labelledby="delete email account">
      <DialogTitle id="delete-email-account-dialog-title">Delete Account</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete the account?</DialogContentText>
        <DialogContentText>Name: {account.name}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} variant="outlined" color="primary">Cancel</Button>
        <form action={deleteEmailAccount}>
          <Button type='submit' variant="contained" color="primary">Delete</Button>
        </form>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteEmailAccount
