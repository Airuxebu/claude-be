import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import { CreateAdminDto } from 'src/admins/dtos/createAdmin.dto';
import { UpdateAdminDto } from 'src/admins/dtos/updateAdmin.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateOrganizationOwnerDto } from 'src/organization-owners/dtos/createOrganizationOwner.dto';
import { OrganizationOwnersService } from 'src/organization-owners/organization-owners.service';
import { CreateOrganizationDto } from 'src/organizations/dtos/createOrganization.dto';
import { UpdateOrganizationDto } from 'src/organizations/dtos/updateOrganization.dto';
import { OrganizationsService } from 'src/organizations/organizations.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('superadmin')
export class SuperadminController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly adminsService: AdminsService,
    private readonly ownersService: OrganizationOwnersService,
  ) {}

  @Get('organizations')
  async findAllOrganizations(@Query('name') name?: string) {
    return await this.organizationsService.findAllOrganizations(name);
  }

  @Get('organizations/:id')
  async findOrganizationById(@Param('id') id: string) {
    return await this.organizationsService.findOrganizationById(id);
  }

  @Post('organizations')
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return await this.organizationsService.createOrganization(
      createOrganizationDto,
    );
  }
  @Patch('organizations/:id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return await this.organizationsService.updateOrganization(
      id,
      updateOrganizationDto,
    );
  }

  @Delete('organizations/:id')
  async deleteOrganization(@Param('id') id: string) {
    return await this.organizationsService.deleteOrganization(id);
  }

  @Post('owners')
  async createOrganizationOwner(createOwnerDto: CreateOrganizationOwnerDto) {
    return await this.ownersService.createOrganizationOwner(createOwnerDto);
  }

  @Post('admins')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return await this.adminsService.createAdmin(createAdminDto);
  }

  @Get('admins')
  async findAllAdmins() {
    return await this.adminsService.findAdmins();
  }

  @Get('admins/:id')
  async findAdminById(@Param('id') id: string) {
    return await this.adminsService.findAdminById(id);
  }

  @Patch('admins/:id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return await this.adminsService.updateAdmin(id, updateAdminDto);
  }

  @Delete('admins/:id')
  async deleteAdmin(@Param('id') id: string) {
    return await this.adminsService.deleteAdmin(id);
  }
}
