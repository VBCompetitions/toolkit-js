import { Metadata } from 'next'
import HomeNav from '@/app/ui/home/nav'

export default async function Page() {
  return (
    <HomeNav />
  )
}

export const metadata: Metadata = {
  title: 'VBC Toolkit',
}
