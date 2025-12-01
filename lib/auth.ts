import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { safeLoginCheck } from "./security";

// Type declarations for NextAuth
declare module "next-auth" {
  interface User {
    role: string;
    clientCode?: string;
    phone?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      clientCode?: string;
      phone?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role: string;
    clientCode?: string;
    phone?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Client Code", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const identifier = credentials.email.trim();

        // Use safe login check to prevent enumeration and timing attacks
        const { valid, user } = await safeLoginCheck(
          identifier,
          credentials.password
        );

        if (!valid || !user) {
          // Always return null to prevent enumeration
          // Response time is normalized in safeLoginCheck
          return null;
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          clientCode: user.clientCode,
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = user.role;
        token.clientCode = user.clientCode;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      const userId = (token.id as string) || (token.sub as string);

      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            clientCode: true,
            phone: true,
          },
        });

        if (dbUser) {
          session.user = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            clientCode: dbUser.clientCode || undefined,
            phone: dbUser.phone || undefined,
          };
          return session;
        }
      } catch {
        // fall back to token-based data below
      }

      if (session.user) {
        session.user.id = userId;
        session.user.role = token.role as string;
        session.user.clientCode = token.clientCode as string;
        session.user.phone = token.phone as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
};

