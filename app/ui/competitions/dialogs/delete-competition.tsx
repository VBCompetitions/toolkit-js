'use client'

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material'

import type { Competition } from '@/app/lib/definitions'

export default function DeleteCompetition (
  { competition, closeDialog }:
  { competition: Competition, closeDialog: () => void }
) {

  async function closeDialogAction () {
    closeDialog()
  }

  async function deleteCompetitionAction () {
    closeDialog()
    // const competitionAPI = new CompetitionAPI()
    // try {
    //   await competitionAPI.deleteCompetition(competition.id)
    //   setLoading(false)
    //   setSuccessMessage('Competition deleted')
    //   navigate('.', { replace: true })
    // } catch (error) {
    //   setErrorMessage(error.message)
    //   setLoading(false)
    // }
  }

  return (
    <Dialog open={true} onClose={closeDialogAction} aria-labelledby="delete competition">
      <DialogTitle id="delete-competition-dialog-title">Delete Competition</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete the competition?</DialogContentText>
        <DialogContentText>Name: {competition.name}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialogAction} variant="outlined" color="primary">Cancel</Button>
        <Button onClick={deleteCompetitionAction} variant="contained" color="primary">Delete</Button>
      </DialogActions>
    </Dialog>
  )
}
