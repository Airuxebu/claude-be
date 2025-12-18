import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [RoomModule],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
