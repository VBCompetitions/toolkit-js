import { Metadata } from 'next'
import { getEmailAccountByUUID } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import Heading from '@/app/ui/heading'
import { Suspense } from 'react'
import CompetitionSkeleton from '@/app/ui/competitions/skeleton'
import ViewAccount from '@/app/ui/emailAccounts/view'

export default async function Page(props: { params: Promise<{ uuid: string }> }) {
  const params = await props.params;
  const uuid = params.uuid

  const emailAccount = await getEmailAccountByUUID(uuid)
  if (!emailAccount) {
    notFound()
  }

  return (
    <Suspense fallback={<CompetitionSkeleton />}>
      <Heading heading={emailAccount.name} />
      <ViewAccount emailAccount={emailAccount} />
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: 'Email Account',
}
