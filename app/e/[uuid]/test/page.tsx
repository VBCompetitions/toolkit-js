import { Metadata } from 'next'
import { getEmailAccountByUUID } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import { Box } from '@mui/material'
import CompetitionSkeleton from '@/app/ui/competitions/skeleton'
import Heading from '@/app/ui/heading'

import TestAccount from '@/app/ui/emailAccounts/test'
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

  const emailAccount = await getEmailAccountByUUID(uuid, session)
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
