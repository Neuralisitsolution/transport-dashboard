import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'OWNER' | 'PRIVATE_MEMBER';
      privateMemberId: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'OWNER' | 'PRIVATE_MEMBER';
    privateMemberId: string | null;
  }
}
