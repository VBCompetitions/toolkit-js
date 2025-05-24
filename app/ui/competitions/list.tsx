'use server'

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
import { auth } from '@/auth'
import RBAC, { Roles } from '@/app/lib/rbac'
import { getCompetitions } from '@/app/lib/database'
import getLogger from '@/app/lib/logger'

export default async function CompetitionList () {
  const logger = await getLogger()
  const session = await auth()

  if (!session) {
    logger.error('attempting to list competitions failed due to missing session')
    await RBAC.forceLogout()
    return
  }

  if (!await RBAC.activeCheck(session?.user)) {
    logger.error('attempting to list competitions failed due to user suspension', session)
    await RBAC.forceLogout()
    return
  }

  const competitionList = await getCompetitions(session)

  let newCompetitionButton = null
  if (await RBAC.roleCheck(session?.user, [Roles.ADMIN])) {
    newCompetitionButton = (
      <Box className='text-left pl-2 pb-2'>
        <Link href='/c/add'>
          <Button aria-label="Add competition" variant="outlined" startIcon={<AddRounded />} >Add Competition</Button>
        </Link>
      </Box>
    )
  }

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
