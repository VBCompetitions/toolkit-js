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

export default async function EmailAccountList () {
  const emailAccountList = await getEmailAccounts()

  let newAccountButton = null
  // if (Roles.roleCheck(userInfo.roles, Roles.EmailAccount.add)) {
    newAccountButton = (
      <Box textAlign="left" paddingLeft="10px">
        <Link href='/e/add'>
          <Button aria-label="Add competition" variant="outlined" startIcon={<AddRounded />} >Add Account</Button>
        </Link>
      </Box>
    )
  // }

  return (
    <Box className='p-2 flex flex-col grow'>
      {newAccountButton}
      <Box padding="10px">
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
