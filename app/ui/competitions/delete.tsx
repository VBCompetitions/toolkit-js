import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { deleteCompetition as actionDeleteCompetition } from '@/app/lib/actions/competitions'
import type { CompetitionMetadata } from '@/app/lib/definitions'

function DeleteCompetition (
  { competition, closeDialog } :
  {
    competition: CompetitionMetadata,
    closeDialog: () => void
  }
) {
  const deleteCompetition = () => {
    closeDialog()
    actionDeleteCompetition(competition.uuid)
  }

  return (
    <Dialog open={true} onClose={closeDialog} aria-labelledby="delete competition">
      <DialogTitle id="delete-email-competition-dialog-title">Delete competition</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete the competition?</DialogContentText>
        <DialogContentText>Name: {competition.name}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} variant="outlined" color="primary">Cancel</Button>
        <form action={deleteCompetition}>
          <Button type='submit' variant="contained" color="primary">Delete</Button>
        </form>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteCompetition
