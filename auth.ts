import argon2 from 'argon2'
import Credentials from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'
import { z } from 'zod'
import { authConfig } from  './auth.config'
import { getUserByUsername } from '@/app/lib/database'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = z
        .object({ username: z.string(), password: z.string().min(8) })
        .safeParse(credentials)

      if (parsedCredentials.success) {
        const { username, password } = parsedCredentials.data
        const user = await getUserByUsername(username)
        if (!user) return null
        if(user.state === 'suspended') return null

        const passwordsMatch = await argon2.verify(user.hash, password)

        if (passwordsMatch) {
          return {
            id: user.uuid,
            name: user.username,
            roles: user.roles.split(',')
          }
        }
      }

      console.log('Invalid credentials')
      return null
    },
  })]
})
