import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  teacherId: string;

  @IsOptional()
  @IsString()
  organizationId?: string;
}
