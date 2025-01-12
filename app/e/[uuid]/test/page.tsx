import { Metadata } from 'next'
import { getEmailAccountByUUID } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import { Box } from '@mui/material'
import CompetitionSkeleton from '@/app/ui/competitions/skeleton'
import Heading from '@/app/ui/heading'

import TestAccount from '@/app/ui/emailAccounts/test'
import { Suspense } from 'react'

export default async function Page(props: { params: Promise<{ uuid: string }> }) {
  const params = await props.params
  const uuid = params.uuid

  const emailAccount = await getEmailAccountByUUID(uuid)
  if (!emailAccount) {
    notFound()
  }

  return (
    <Suspense fallback={<CompetitionSkeleton />}>
      <Heading heading={emailAccount.name} />
      <TestAccount uuid={uuid} />
      <Box className='flex grow'></Box>
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: 'Email Configuration',
}
