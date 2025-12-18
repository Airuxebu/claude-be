import { User } from 'src/generated/prisma/client';
import { SafeUser } from 'src/types/safeUser';

export const getSafeUser = (user: User): SafeUser => {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
};
