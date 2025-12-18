import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { RoomService } from 'src/room/room.service';
import { CreateRoomDto } from 'src/room/dtos/createRoomDto';

@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly teachersService: TeachersService,
    private readonly roomService: RoomService,
  ) {}

  @Post('rooms')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomService.createRoom(createRoomDto);
  }
  @Get('rooms')
  async findRooms({ teacherId }: { teacherId: string }) {
    return await this.roomService.findRooms(teacherId);
  }

  @Get('rooms/:id')
  async findRoomById(@Param('id') id: string) {
    return await this.roomService.findRoomById(id);
  }
}
