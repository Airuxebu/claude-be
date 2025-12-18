import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AdminsModule } from './admins/admins.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { OrganizationOwnersModule } from './organization-owners/organization-owners.module';
import { RoomModule } from './room/room.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { TranslationModule } from './translation/translation.module';
import { GenaiModule } from './genai/genai.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    SuperadminModule,
    OrganizationsModule,
    AdminsModule,
    TeachersModule,
    StudentsModule,
    OrganizationOwnersModule,
    RoomModule,
    ChatMessageModule,
    TranslationModule,
    GenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
