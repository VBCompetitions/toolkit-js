import { Metadata } from 'next'
import { getCompetitionByUUID, getEmailAccounts } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import CompetitionSkeleton from '@/app/ui/competitions/skeleton'
import Heading from '@/app/ui/heading'

import Email from '@/app/ui/emailReminders/email'
import { Suspense } from 'react'

export default async function Page(props: { params: Promise<{ uuid: string }> }) {
  const params = await props.params
  const uuid = params.uuid

  const competition = await getCompetitionByUUID(uuid)
  if (!competition) {
    notFound()
  }

  const emailAccounts = await getEmailAccounts()

  return (
    <Suspense fallback={<CompetitionSkeleton />}>
      <Heading heading={competition.name} />
      <Email uuid={uuid} emailAccounts={emailAccounts} />
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: 'Email Configuration',
}
