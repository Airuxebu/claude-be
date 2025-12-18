import { UpdateOrganizationDto } from 'src/organizations/dtos/updateOrganization.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationDto } from './dtos/createOrganization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllOrganizations(name?: string) {
    if (name) {
      return await this.prisma.organization.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
        include: {
          users: true,
          rooms: true,
        },
      });
    }

    return await this.prisma.organization.findMany({
      include: { users: true, rooms: true },
    });
  }

  async findOrganizationById(id: string) {
    return await this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: true,
        rooms: true,
      },
    });
  }

  async createOrganization(createOrganizationDto: CreateOrganizationDto) {
    const newOrganization = await this.prisma.organization.create({
      data: { ...createOrganizationDto },
    });

    if (!newOrganization)
      throw new BadRequestException('Could not create organization');

    return newOrganization;
  }

  async updateOrganization(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const updatedOrganization = await this.prisma.organization.update({
      where: { id },
      data: {
        ...updateOrganizationDto,
      },
    });

    if (!updatedOrganization)
      throw new BadRequestException('Could not update organization');

    return updatedOrganization;
  }

  async deleteOrganization(id: string) {
    const candidate = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!candidate)
      throw new BadRequestException('Organization does not exist');

    const deletedOrganization = await this.prisma.organization.delete({
      where: { id },
    });

    if (!deletedOrganization)
      throw new BadRequestException('Could not delete organization');

    return deletedOrganization;
  }
}
