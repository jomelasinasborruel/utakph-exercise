import cuid from "cuid";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Creds",
      credentials: {
        email: { type: "text", placeholder: "enter email" },
        pass: { type: "text", placeholder: "enter email" },
      },
      async authorize(credentials) {
        return { id: cuid(), email: credentials?.email };
      },
    }),
  ],

  pages: { signIn: "/sign-in" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
