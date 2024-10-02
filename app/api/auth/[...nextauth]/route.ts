import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import pool from '@/lib/db';
import { compare } from 'bcrypt';
import { RowDataPacket } from 'mysql2';



export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error('Missing credentials');
          return null;
        }

        try {
          const [users] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM admins WHERE username = ?',
            [credentials.username]
          );

          if (!users || users.length === 0) {
            console.error('User not found');
            return null;
          }

          const user = users[0];

          const isPasswordCorrect = await compare(credentials.password, user.password);

          if (!isPasswordCorrect) {
            console.error('Incorrect password');
            return null;
          }

          return {
            id: user.id,
            username: user.username,
          };
        } catch (error) {
          console.error('Error in authorize function:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
