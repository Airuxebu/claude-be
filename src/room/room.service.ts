import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dtos/createRoomDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    const room = await this.prisma.room.create({
      data: {
        ...createRoomDto,
      },
    });

    if (!room) throw new BadRequestException('Error creating room');

    return room;
  }

  async findRooms(teacherId?: string) {
    if (teacherId) {
      return await this.prisma.room.findMany({ where: { teacherId } });
    }
    return await this.prisma.room.findMany();
  }

  async findRoomById(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { chatMessages: true },
    });
    if (!room) throw new BadRequestException('No such room exists');

    const qr = await QRCode.toDataURL(
      `http://localhost:5173/lessons/${room.id}`,
    );

    if (!qr) throw new BadRequestException('Error generating qr');

    return { ...room, qr };
  }
}
