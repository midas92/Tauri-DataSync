import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    secret:process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '' ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ||'',
      httpOptions:{
        timeout:50000,
      },
      authorization: {
        params: {
          scope: "openid https://www.googleapis.com/auth/drive",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, }:any) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, }:any) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
