'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  IconButton,
  TableCell,
  TableRow,
  Typography
} from '@mui/material'
import {
  DeleteRounded,
  EditRounded,
  LinkRounded,
  LockResetRounded
} from '@mui/icons-material'

import { UserRecord } from '@/app/lib/definitions'
import DeleteUser from './delete'
import UserLink from './userLink'

export default function UserRow (
  { user } :
  { user: UserRecord }) {

  const [deleteUserOpen, setDeleteUserOpen] = useState(false)
  const [userLinkOpen, setUserLinkOpen] = useState(false)

  const openDeleteUser = () => {
    setDeleteUserOpen(true)
  }

  const closeDeleteUser = () => {
    setDeleteUserOpen(false)
  }

  const openUserLink = () => {
    setUserLinkOpen(true)
  }

  const closeUserLink = () => {
    setUserLinkOpen(false)
  }

  return (
    <>
    <TableRow key={user.uuid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align='center'>{user.username}</TableCell>
      <TableCell align='center'>{user.lastLogin}</TableCell>
      <TableCell align='center'>
        <Typography textAlign='center' variant='body2' component='span' className={user.state === 'active' ? 'text-green-700' : user.state === 'suspended' ? 'text-orange-500' : 'text-blue-500' }>{user.state}</Typography>
        {
          user.state === 'pending'
          ?
          <IconButton size='small' edge='start' color='inherit' aria-label='menu' sx={{ marginLeft: '4px', mr: 2 }} >
            <LinkRounded onClick={openUserLink} />
          </IconButton>
          :
          null
        }
      </TableCell>
      <TableCell align='center'>{user.roles.join(', ')}</TableCell>
      <TableCell align='right'>
        {
          user.username === 'admin'
          ?
          null
          :
          <>
            {
              user.state === 'pending'
              ?
              null
              :
              <IconButton size='small' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} >
                <LockResetRounded />
              </IconButton>
            }
            <Link href={`/admin/users/${user.uuid}/update`}>
              <IconButton size='small' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} >
                <EditRounded />
              </IconButton>
            </Link>
            <IconButton size='small' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} >
              <DeleteRounded onClick={openDeleteUser} />
            </IconButton>
          </>
        }
      </TableCell>
    </TableRow>
    { deleteUserOpen ? <DeleteUser user={user} closeDialog={closeDeleteUser} /> : null }
    { userLinkOpen ? <UserLink user={user} closeDialog={closeUserLink} /> : null }
    </>
  )
}
