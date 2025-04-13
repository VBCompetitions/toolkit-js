import Link from 'next/link'
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import {
  PersonAddAltRounded
} from '@mui/icons-material'

import { getUsers } from '@/app/lib/database'
import UserRow from './userRow'

export default async function UserList () {
  const userList = await getUsers()

  let newUserButton = null
  // // if (Roles.roleCheck(userInfo.roles, Roles.Competition.create)) {
    newUserButton = (
      <Box className='text-left pl-2 pb-2'>
        <Link href='/admin/users/add'>
          <Button aria-label="New User" variant="outlined" startIcon={<PersonAddAltRounded />} >New User</Button>
        </Link>
      </Box>
    )
  // // }

  return (
    <Box className='p-2 flex flex-col grow'>
      {newUserButton}
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead className='bg-blue-500'>
            <TableRow className='data-table'>
              <TableCell align='center'>
                <Typography textAlign='center' variant='button' component='div' className='text-white'>Username</Typography>
              </TableCell>
              <TableCell align='center'>
                <Typography textAlign='center' variant='button' component='div' className='text-white'>Last Login</Typography>
              </TableCell>
              <TableCell align='center'>
                <Typography textAlign='center' variant='button' component='div' className='text-white'>State</Typography>
              </TableCell>
              <TableCell align='center'>
                <Typography textAlign='center' variant='button' component='div' className='text-white'>Roles</Typography>
              </TableCell>
              <TableCell align='center'>
                <Typography textAlign='center' variant='button' component='div' className='text-white'>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {userList.sort((a, b) => {
              if (a.username === 'admin') return -1
              return a.username.localeCompare(b.username)
            }).map(user => (
              <UserRow key={user.uuid} user={user} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
