import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from 'src/generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('superadmin', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: passwordHash,
      name: 'admin',
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.log('Super admin created:', superAdmin);

  const teacherPassword = await bcrypt.hash('1111', 10);

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@gmail.com' },
    update: {},
    create: {
      email: 'teacher@gmail.com',
      password: teacherPassword,
      name: 'teacher',
      role: UserRole.TEACHER,
    },
  });

  console.log('Super admin created:', teacher);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
