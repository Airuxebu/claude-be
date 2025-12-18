import { Controller } from '@nestjs/common';
import { OrganizationOwnersService } from './organization-owners.service';

@Controller('organization-owners')
export class OrganizationOwnersController {
  constructor(private readonly organizationOwnersService: OrganizationOwnersService) {}
}
