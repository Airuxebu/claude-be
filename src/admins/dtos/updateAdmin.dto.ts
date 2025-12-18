import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/generated/prisma/enums';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @Min(0)
  organizationId?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
