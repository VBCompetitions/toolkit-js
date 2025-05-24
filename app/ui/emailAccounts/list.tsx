import { getEmailAccounts } from '@/app/lib/database'
import {
  Box,
  Button,
  Link,
  Grid2,
} from '@mui/material'
import {
  AddRounded
} from '@mui/icons-material'
import EmailAccountCard from './card'
import RBAC, { Roles } from '@/app/lib/rbac'
import { auth } from '@/auth'
import { InsufficientRoles } from '../home/insufficientRoles'

export default async function EmailAccountList () {
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

  const emailAccountList = await getEmailAccounts(session)

  let newAccountButton = null
  // if (Roles.roleCheck(userInfo.roles, [Roles.EmailAccount.add])) {
    newAccountButton = (
      <Box className='text-left pl-2 pb-2'>
        <Link href='/e/add'>
          <Button aria-label="Add competition" variant="outlined" startIcon={<AddRounded />} >Add Account</Button>
        </Link>
      </Box>
    )
  // }

  return (
    <Box className='p-2 flex flex-col grow'>
      {newAccountButton}
      <Box className='p-2'>
        <Grid2 container spacing={2}>
          {emailAccountList.sort((a, b) => {
            return a.name.localeCompare(b.name)
          }).map(emailAccount => (
            <EmailAccountCard key={emailAccount.uuid} account={emailAccount} />
          ))}
        </Grid2>
      </Box>
    </Box>
  )
}
