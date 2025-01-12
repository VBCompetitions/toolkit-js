import Link from 'next/link';
import {
  Box,
  Typography
} from '@mui/material'
import {
  EmailRounded,
  SportsVolleyballRounded
} from '@mui/icons-material'

export default function HomeNav() {

  const links = [
    { name: 'Competitions', href: '/c', icon: SportsVolleyballRounded },
    { name: 'Email Accounts', href: '/e', icon: EmailRounded }
  ]

  return (
    <Box className='flex h-full flex-col pt-6 pb-3 py-4 md:px-2'>
      <Box className='flex justify-between space-x-2 md:space-x-0 md:space-y-2'>
        <Box className='block grow'></Box>
        <Box className='flex flex-col'>
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Box key={link.name} className='p-2'>
                <Link
                  href={link.href}
                  className='flex h-[48px] items-center justify-center gap-2 rounded-md p-3 text-medium font-medium md:flex-none md:justify-start md:p-2 md:px-3 bg-blue-500 text-white'
                  >
                  <LinkIcon className='w-6' />
                  <Typography>{link.name}</Typography>
                </Link>
              </Box>
            );
          })}
        </Box>
        <Box className='block grow'></Box>
      </Box>
    </Box>
  );
}
