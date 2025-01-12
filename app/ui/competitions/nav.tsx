'use client'

import Link from 'next/link';
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import {
  ArrowBackRounded,
  DashboardRounded,
  EmailRounded,
  RequestQuoteRounded
} from '@mui/icons-material'

export default function CompetitionNav(
  { uuid } :
  { uuid: string }
) {
  const pathname = usePathname()

  const links = [
    { name: 'Competitions', href: `/c`, icon: ArrowBackRounded, pad: true },
    { name: 'Overview', href: `/c/${uuid}`, icon: DashboardRounded },
    { name: 'Email reminders', href: `/c/${uuid}/email`, icon: EmailRounded },
    { name: 'Invoices', href: `/c/${uuid}/invoices`, icon: RequestQuoteRounded }
  ]

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-medium font-medium md:flex-none md:justify-start md:p-2 md:px-3',
                { 'hover:bg-sky-100 bg-gray-50 text-gray-700': pathname !== link.href },
                { 'hover:bg-blue-500 bg-blue-500 text-white': pathname === link.href },
                { 'mb-4 md:mb-4' : link.pad}
              )}
              >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
      </div>
    </div>
  );
}
