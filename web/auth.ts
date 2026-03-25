import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Facebook from 'next-auth/providers/facebook'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    refreshToken: string
    user: DefaultSession['user'] & {
      isVerify?: boolean
    }
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
    isVerify?: boolean
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Only call backend on first sign-in (when account is present)
      if (account && profile) {
        const serviceUrl =
          process.env.NEXT_PUBLIC_SERVICE_URL || 'http://localhost:3030'

        const p = profile as Record<string, unknown>
        const image =
          (typeof p.picture === 'string' ? p.picture : null) ||
          (typeof p.avatar_url === 'string' ? p.avatar_url : null) ||
          token.picture ||
          ''

        const res = await fetch(`${serviceUrl}/api/v1/auth/oauth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: account.provider,
            providerId: account.providerAccountId,
            email: profile.email,
            displayName: profile.name,
            image,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          token.accessToken = data.token.accessToken as string
          token.refreshToken = data.token.refreshToken as string
          token.isVerify = data.account.isVerify as boolean
          token.picture = data.account.image as string
          token.name = data.account.displayName as string
          token.email = data.account.email as string
        }
      }

      return token
    },

    async session({ session, token }) {
      const t = token as typeof token & {
        accessToken?: string
        refreshToken?: string
        isVerify?: boolean
      }
      session.accessToken = t.accessToken ?? ''
      session.refreshToken = t.refreshToken ?? ''
      session.user.isVerify = t.isVerify ?? false
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  secret: process.env.AUTH_SECRET,
})
