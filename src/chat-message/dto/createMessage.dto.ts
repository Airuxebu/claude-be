import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsNumber()
  @IsPositive()
  senderId: string;
}
