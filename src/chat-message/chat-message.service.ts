import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/createMessage.dto';

@Injectable()
export class ChatMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const createdMessage = await this.prisma.chatMessage.create({
      data: createMessageDto,
    });

    if (!createdMessage)
      throw new BadRequestException('Error creating message');
    return createdMessage;
  }
}
