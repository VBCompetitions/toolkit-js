import { Metadata } from 'next'
import { getCompetitionByUUID } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import Heading from '@/app/ui/heading'
import { Suspense } from 'react'
import CompetitionSkeleton from '@/app/ui/competitions/skeleton'
import { InsufficientRoles } from '@/app/ui/home/insufficientRoles'
import { auth } from '@/auth'
import RBAC, { Roles } from '@/app/lib/rbac'

export default async function Page(props: { params: Promise<{ uuid: string }> }) {
  const params = await props.params;
  const uuid = params.uuid
  const session = await auth()

  if (!session) {
    // TODO, this should force a logout
    return (
      <InsufficientRoles />
    )
  }

  if (!await RBAC.roleCheck(session?.user, [Roles.ADMIN])) {
    return (
      <InsufficientRoles />
    )
  }

  const competition = await getCompetitionByUUID(uuid, session)
  if (!competition) {
    notFound()
  }

  return (
    <Suspense fallback={<CompetitionSkeleton />}>
      <Heading heading={competition.name} />
      <p>overview</p>
      <p>Todo - add delete and edit buttons</p>
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: 'Competition',
}
