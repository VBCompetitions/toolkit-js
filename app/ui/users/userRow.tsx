'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
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
import ResetUser from './reset'

export default function UserRow (
  { user } :
  { user: UserRecord }) {

  const [deleteUserOpen, setDeleteUserOpen] = useState(false)
  const [resetUserOpen, setResetUserOpen] = useState(false)
  const [userLinkOpen, setUserLinkOpen] = useState(false)

  const openResetUser = () => {
    setResetUserOpen(true)
  }

  const closeResetUser = () => {
    setResetUserOpen(false)
  }

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
        <Typography textAlign='center' variant='body2' component='span' className={user.state === 'active' ? 'text-green-700' : user.state === 'suspended' ? 'text-red-500' : 'text-blue-500' }>{user.state}</Typography>
        {
          user.state === 'pending'
          ?
          <Tooltip title="Activation Details">
            <IconButton size='small' edge='start' color='inherit' aria-label='menu' sx={{ marginLeft: '4px', mr: 2 }} >
              <LinkRounded onClick={openUserLink} />
            </IconButton>
          </Tooltip>
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
              <Tooltip title="Reset">
                <IconButton size='small' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} >
                  <LockResetRounded onClick={openResetUser} />
                </IconButton>
              </Tooltip>
            }
            <Tooltip title="Update">
              <Link href={`/admin/users/${user.uuid}/update`}>
                <IconButton size='small' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} >
                  <EditRounded />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size='small' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} >
                <DeleteRounded onClick={openDeleteUser} />
              </IconButton>
            </Tooltip>
          </>
        }
      </TableCell>
    </TableRow>
    { resetUserOpen ? <ResetUser user={user} closeDialog={closeResetUser} /> : null }
    { deleteUserOpen ? <DeleteUser user={user} closeDialog={closeDeleteUser} /> : null }
    { userLinkOpen ? <UserLink user={user} closeDialog={closeUserLink} /> : null }
    </>
  )
}
