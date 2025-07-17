import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { sendRequest } from "./utils/api";
import { IUser } from "./types/next-auth";
import { InvalidEmailPasswordError } from "./utils/error";
import GoogleProvider from "next-auth/providers/google";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials:{
        username: {},
        password: {},
      },
      authorize: async(credentials)=>{
        const res = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: 'http://127.0.0.1:8000/api/auth/login/',
          body: {
            username_or_email: credentials?.username,
            password: credentials?.password,
          }
        });

        const user = res?.data?.user;
        const token = res?.data?.access_token;

        if (res.statusCode === 201 && user && user.id && token) {
            return {
              id: user.id,
              avatar: user.avatar || "",
              email: user.email || "",
              full_name: user.full_name || "",
              is_admin: user.is_admin,
              is_staff_member: user.is_staff_member,
              phone: user.phone || "",
              role: user.role || "",
            };
        }
        else if(+res.statusCode === 400){
          throw new InvalidEmailPasswordError();
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.user = user as IUser
      }
      return token
    },
    session({ session, token }) {
      (session.user as IUser) = token.user
      session.access_token = token.access_token as string;
      session.refresh_token = token.refresh_token as string;
      return session
    },
  },
})