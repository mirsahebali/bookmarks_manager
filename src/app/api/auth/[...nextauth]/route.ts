import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "@/lib/prisma";
import EmailProvider from "next-auth/providers/email";
//We have used Email Magic link and Google Oauth2 as auth authenitcation system
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.NEXT_PUBLIC_EMAIL_SERVER!,
      from: process.env.NEXT_PUBLIC_EMAIL_FROM!,
    }),
  ],
  //routes to our custom page at @/src/app/user/auth/sigin and @/src/app/user/welcome
  pages: {
    signIn: "/user/auth/signin",
    newUser: "/user/welcome",
  },
  callbacks: {
    //Creates a callback and checks if the user has no workspace, then automatically create a new one on a new session or login
    async session({ session, user, newSession, trigger }) {
      const workspaceLength = await prisma.workspace.count({
        where: { email: user.email },
      });
      if (workspaceLength === 0) {
        await prisma.user.update({
          where: {
            email: user?.email!,
          },
          data: {
            workspaces: {
              create: [
                {
                  email: user?.email!,
                  name: "Default",
                  inbox: {
                    create: {
                      email: user?.email!,
                      tabs: {
                        create: [
                          {
                            name: "Tab",
                            lists: {
                              create: [
                                {
                                  name: "List",
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        });
        return session;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
