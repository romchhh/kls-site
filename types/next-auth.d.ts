import "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    clientCode?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      clientCode?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    clientCode?: string;
  }
}

