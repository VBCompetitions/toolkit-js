'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  AppBar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material'
import {
  HomeRounded,
  LogoutRounded,
  Menu as MenuIcon
} from '@mui/icons-material'
import { logout } from '@/app/lib/actions/auth'
import { MenuAction } from '@/app/lib/definitions'


// import packageJson from '../package.json';

export default function Banner(
  { menuActions, username }:
  {
    menuActions: MenuAction [],
    username: string | null | undefined
  }
) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openHamburger = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeHamburger = () => {
    setAnchorEl(null)
  }

  const menuItems = menuActions.map(action => (
    <Link key={action.key} href={action.link}>
      <MenuItem onClick={closeHamburger}>
        <ListItemIcon>
          {action.icon}
        </ListItemIcon>
        <ListItemText>{action.title}</ListItemText>
      </MenuItem>
    </Link>
  ))

  menuItems.push(
    <form key='logout' action={async () => {
        console.log('logging out in the Banner')
        await logout()
      }}>
      <button>
        <MenuItem onClick={closeHamburger}>
          <ListItemIcon>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText>Log out</ListItemText>
        </MenuItem>
      </button>
    </form>
  )

  return (
    <>
      <AppBar position='static' className='flex'>
        <Toolbar>
          <Link
            href='/'
            className='flex h-[48px] items-center justify-center gap-2 rounded-md p-3 text-medium font-medium md:flex-none md:justify-start md:p-2 md:px-3'
            >
            <HomeRounded className="w-6 text-white" />
          </Link>
          <Typography className='grow text-center' variant='h6' component='div'>
            VBC Toolkit
          </Typography>
          <Box className='flex items-center'>
            {
              username
              ?
              <>
                <Typography className='pr-2' variant='body1' component='span'>{username}</Typography>
                <IconButton size='large' aria-label='account of current user' aria-controls='menu-appbar'
                  aria-haspopup='true' onClick={openHamburger} color='inherit'>
                  <MenuIcon />
                </IconButton>
              </>
              :
              null
            }
            <Menu id='menu-appbar' anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
              keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right', }}
              open={Boolean(anchorEl)} onClose={closeHamburger}>
              {menuItems}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}

