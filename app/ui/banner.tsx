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
  AccountCircleRounded,
  HomeRounded,
  LogoutRounded,
  MailOutlineRounded,
  Menu as MenuIcon,
  PeopleOutlineRounded,
  SettingsRounded,
  SportsVolleyballRounded
} from '@mui/icons-material'
import { logout } from '@/app/lib/actions'

// import packageJson from '../package.json';

export default function Banner() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const userInfo = {
    loggedIn: true
  }
  const openUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeUserMenu = () => {
    setAnchorEl(null)
  }

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
          <Box>
            {
              userInfo.loggedIn
              ?
              <>
                <IconButton size='large' aria-label='account of current user' aria-controls='menu-appbar'
                  aria-haspopup='true' onClick={openUserMenu} color='inherit'>
                  <MenuIcon />
                </IconButton>
              </>
              :
              null
            }
            <Menu id='menu-appbar' anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
              keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right', }}
              open={Boolean(anchorEl)} onClose={closeUserMenu}>
              {
                [
                  <Link key='competitions' href='/c'>
                    <MenuItem onClick={closeUserMenu}>
                      <ListItemIcon>
                        <SportsVolleyballRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Competitions</ListItemText>
                    </MenuItem>
                  </Link>,
                  <Link key='email-accounts' href='/e'>
                    <MenuItem onClick={closeUserMenu}>
                      <ListItemIcon>
                        <MailOutlineRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Email Accounts</ListItemText>
                    </MenuItem>
                  </Link>,
                  <Link key='users' href='/admin/users'>
                    <MenuItem onClick={closeUserMenu}>
                      <ListItemIcon>
                        <PeopleOutlineRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Users</ListItemText>
                    </MenuItem>
                  </Link>,
                    <Link key='settings' href='/admin/settings'>
                    <MenuItem onClick={closeUserMenu}>
                      <ListItemIcon>
                        <SettingsRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Settings</ListItemText>
                    </MenuItem>
                  </Link>,
                  <Link key='account' href='/account'>
                    <MenuItem onClick={closeUserMenu}>
                      <ListItemIcon>
                        <AccountCircleRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Account</ListItemText>
                    </MenuItem>
                  </Link>,
                  <form key='logout' action={async () => {
                      console.log('logging out in the Banner')
                      await logout()
                    }}>
                    <button>
                      <MenuItem onClick={closeUserMenu}>
                        <ListItemIcon>
                          <LogoutRounded fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Log out</ListItemText>
                      </MenuItem>
                    </button>
                  </form>
                ]
              }
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}
