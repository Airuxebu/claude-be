import { Module } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { SuperadminController } from './superadmin.controller';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { AdminsModule } from 'src/admins/admins.module';
import { OrganizationOwnersModule } from 'src/organization-owners/organization-owners.module';

@Module({
  imports: [OrganizationsModule, AdminsModule, OrganizationOwnersModule],
  controllers: [SuperadminController],
  providers: [SuperadminService],
})
export class SuperadminModule {}
