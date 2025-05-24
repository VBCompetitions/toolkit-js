import { Session } from "next-auth";
import {
  AccountCircleRounded,
  MailOutlineRounded,
  PeopleOutlineRounded,
  SportsVolleyballRounded,
  SettingsRounded
} from "@mui/icons-material";
import RBAC, { Roles } from "./rbac";

export default async function getMenuActions (session: Session | null) {
  const menuActions = [
    {
      key: 'competitions',
      link: '/c',
      icon: <SportsVolleyballRounded fontSize="small" />,
      title: 'Competitions'
    },
    {
      key: 'email-accounts',
      link: '/e',
      icon: <MailOutlineRounded fontSize="small" />,
      title: 'Email Accounts'
    }
  ]

  if (await RBAC.roleCheck(session?.user, [Roles.ADMIN])) {
    menuActions.push(
      {
        key: 'users',
        link: '/admin/users',
        icon: <PeopleOutlineRounded fontSize="small" />,
        title: 'Users'
      },
      {
        key: 'settings',
        link: '/admin/settings',
        icon: <SettingsRounded fontSize="small" />,
        title: 'Settings'
      },
    )
  }

  menuActions.push(
    {
      key: 'account',
      link: '/account',
      icon: <AccountCircleRounded fontSize="small" />,
      title: 'Account'
    }
  )

  return menuActions
}
