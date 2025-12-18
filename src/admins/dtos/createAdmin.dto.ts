import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Min(0)
  organizationId: string;
}
