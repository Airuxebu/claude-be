import { Module } from '@nestjs/common';
import { OrganizationOwnersService } from './organization-owners.service';
import { OrganizationOwnersController } from './organization-owners.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [OrganizationOwnersController],
  providers: [OrganizationOwnersService],
  exports: [OrganizationOwnersService],
})
export class OrganizationOwnersModule {}
