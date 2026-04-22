import type { DefaultSession } from "next-auth";

import type { RoleKey } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: RoleKey;
    } & DefaultSession["user"];
  }

  interface User {
    roleKey?: RoleKey | null;
  }
}
