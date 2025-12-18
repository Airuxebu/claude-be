import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({ origin: String(process.env.FRONTEND_URL) });
  await app.listen(process.env.PORT ?? 5000);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 5000}`,
  );
}
bootstrap();
