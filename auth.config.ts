import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user

      if (nextUrl.pathname === '/login') {
        if (isLoggedIn) {
          return Response.redirect(new URL('/c', nextUrl))
        }
      } else {

      }
      return isLoggedIn
    }
  },
  providers: []
} satisfies NextAuthConfig
