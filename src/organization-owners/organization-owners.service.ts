import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationOwnerDto } from './dtos/createOrganizationOwner.dto';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { UserRole } from 'src/generated/prisma/enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrganizationOwnersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async createOrganizationOwner(createOwnerDto: CreateOrganizationOwnerDto) {
    const existingOwner = await this.prisma.user.findUnique({
      where: { email: createOwnerDto.email },
    });

    if (existingOwner)
      throw new BadRequestException('User with such email already exists');

    const organization = await this.organizationsService.findOrganizationById(
      createOwnerDto.organizationId,
    );

    if (!organization)
      throw new BadRequestException('Organization does not exist');

    const hashedPassword = await bcrypt.hash(createOwnerDto.password, 10);

    if (!hashedPassword)
      throw new BadRequestException('Error while creating password');

    const organizationOwner = await this.prisma.user.create({
      data: {
        ...createOwnerDto,
        role: UserRole.ORGANIZATION_OWNER,
        password: hashedPassword,
      },
    });

    if (!organizationOwner)
      throw new BadRequestException('Invalid organization owner data');

    return organizationOwner;
  }
}
