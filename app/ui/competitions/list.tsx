import Link from 'next/link'
import {
  Box,
  Button,
  Grid2
} from '@mui/material'
import {
  AddRounded
} from '@mui/icons-material'

import CompetitionCard from './card'

import { getCompetitions } from '@/app/lib/database'

export default async function CompetitionList () {
  const competitionList = await getCompetitions()

  let newCompetitionButton = null
  // if (Roles.roleCheck(userInfo.roles, Roles.Competition.create)) {
    newCompetitionButton = (
      <Box className='text-left pl-2 pb-2'>
        <Link href='/c/add'>
          <Button aria-label="Add competition" variant="outlined" startIcon={<AddRounded />} >Add Competition</Button>
        </Link>
      </Box>
    )
  // }

  return (
    <Box className='p-2 flex flex-col grow'>
      {newCompetitionButton}
      <Box className='p-2'>
        <Grid2 container spacing={2}>
          {competitionList.sort((a, b) => {
            return a.name.localeCompare(b.name)
          }).map(competition => (
            <CompetitionCard key={competition.uuid} competition={competition} />
          ))}
        </Grid2>
      </Box>
    </Box>
  )
}
