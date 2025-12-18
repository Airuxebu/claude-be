import { UserRole } from 'src/generated/prisma/enums';

export type SafeUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
};
