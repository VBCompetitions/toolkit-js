import { Metadata } from 'next'
import { getCompetitionByUUID } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import Heading from '@/app/ui/heading'
import { Suspense } from 'react'
import CompetitionSkeleton from '@/app/ui/competitions/skeleton'

export default async function Page(props: { params: Promise<{ uuid: string }> }) {
  const params = await props.params;
  const uuid = params.uuid

  // TODO
  // Do invoices go to team or club secretary?
  // Roke tournament says go to team (and group by person/email?)
  // SADVA says go to club
  const competition = await getCompetitionByUUID(uuid)
  if (!competition) {
    notFound()
  }

  return (
    <Suspense fallback={<CompetitionSkeleton />}>
      <Heading heading={competition.name} />
      <p>competition invoice view</p>
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: 'Invoices',
}
