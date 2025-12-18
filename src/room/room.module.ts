import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';
import { RoomGateway } from './room.gateway';
import { TranslationModule } from 'src/translation/translation.module';
import { GenaiModule } from 'src/genai/genai.module';

@Module({
  imports: [PrismaModule, ChatMessageModule, TranslationModule, GenaiModule],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
  exports: [RoomService],
})
export class RoomModule {}
