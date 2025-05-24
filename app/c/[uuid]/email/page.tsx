import { Metadata } from 'next'
import { getCompetitionByUUID, getEmailAccounts } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import CompetitionSkeleton from '@/app/ui/competitions/skeleton'
import Heading from '@/app/ui/heading'

import Email from '@/app/ui/emailReminders/email'
import { Suspense } from 'react'
import RBAC, { Roles } from '@/app/lib/rbac'
import { InsufficientRoles } from '@/app/ui/home/insufficientRoles'
import { auth } from '@/auth'

export default async function Page(props: { params: Promise<{ uuid: string }> }) {
  const params = await props.params
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

  const emailAccounts = await getEmailAccounts(session)

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
