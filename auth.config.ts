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

    },
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    }
  },
  providers: []
} satisfies NextAuthConfig
