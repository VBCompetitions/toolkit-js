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
import DeleteCompetition from './delete'

import type { CompetitionMetadata } from '@/app/lib/definitions'

export default function CompetitionCard (
  { competition } :
  { competition: CompetitionMetadata }
) {
  const [deleteCompetitionOpen, setDeleteCompetitionOpen] = useState(false)

  const openDeleteCompetition = () => {
    setDeleteCompetitionOpen(true)
  }

  const closeDeleteCompetition = () => {
    setDeleteCompetitionOpen(false)
  }

  let type = ''
  if (competition.type === 'url') {
    type = 'URL linked'
  } else if (competition.type === 'file') {
    type = 'local file'
  } else if (competition.type === 'json') {
    type = 'local JSON'
  } else {
    type = 'unknown'
  }

  return (
    <>
      <Box sx={{ minWidth: 200 }}>
        <Card variant='outlined' sx={{ width: 250 }}>
          <CardActionArea>
            <Link href={`/c/${competition.uuid}`} className='block'>
              <CardContent className='flex flex-col'>
                <Box>
                  {
                    competition.name.length > 50
                    ?
                    <Tooltip title={competition.name.substring(0, 150)} >
                      <Typography variant='h5' component='div'>{competition.name.substring(0, 49)}...</Typography>
                    </Tooltip>
                    :
                    <Typography variant='h5' component='div'>{competition.name}</Typography>
                  }
                  <Typography className='text-left text-blue-500' variant='body2' component='div'>[{type}]</Typography>
                </Box>
              </CardContent>
            </Link>
          </CardActionArea>
          <CardActions sx={{ paddingTop: '0px' }}>
            <Box className='grow flex justify-end'>
              <Box className='px-2'>
                <Link href={`/c/${competition.uuid}`} className='block'>
                  <IconButton size='small' aria-label='competition edit' aria-controls='competition-edit-button' aria-haspopup='true' color='inherit'>
                    <EditRounded color='action' />
                  </IconButton>
                </Link>
              </Box>
              <IconButton size='small' aria-label='competition delete' aria-controls='competition-delete-button' aria-haspopup='true' color='inherit'>
                <DeleteRounded onClick={openDeleteCompetition} color='action' />
              </IconButton>
            </Box>
          </CardActions>
        </Card>
      </Box>
      { deleteCompetitionOpen ? <DeleteCompetition competition={competition} closeDialog={closeDeleteCompetition} /> : null }
    </>
  )
}
