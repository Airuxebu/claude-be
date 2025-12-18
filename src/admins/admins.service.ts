import { UpdateAdminDto } from './dtos/updateAdmin.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dtos/createAdmin.dto';
import { UserRole } from 'src/generated/prisma/enums';
import { OrganizationsService } from 'src/organizations/organizations.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationService: OrganizationsService,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createAdminDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    if (!hashedPassword)
      throw new BadRequestException('User with this email already exists');

    const newAdmin = await this.prisma.user.create({
      data: {
        ...createAdminDto,
        role: UserRole.ADMIN,
        password: hashedPassword,
      },
    });

    if (!newAdmin) throw new BadRequestException('Failed to create admin');
    return newAdmin;
  }

  async findAdminById(id: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id, role: UserRole.ADMIN },
      include: { organization: true },
    });

    if (!admin) throw new BadRequestException('Admin not found');
    return admin;
  }

  async findAdmins() {
    return await this.prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      include: { organization: true },
    });
  }

  async updateAdmin(id: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findAdminById(id);

    if (!admin) throw new BadRequestException('Admin not found');

    if (updateAdminDto.organizationId) {
      const organization = await this.organizationService.findOrganizationById(
        updateAdminDto.organizationId,
      );
      if (!organization)
        throw new BadRequestException('Organization not found');
    }

    const updatedAdmin = await this.prisma.user.update({
      where: { id },
      data: { ...updateAdminDto },
    });

    return updatedAdmin;
  }

  async deleteAdmin(id: string) {
    const admin = await this.findAdminById(id);

    if (!admin) throw new BadRequestException('Admin not found');

    const deletedAdmin = await this.prisma.user.delete({
      where: { id },
    });

    return deletedAdmin;
  }
}
