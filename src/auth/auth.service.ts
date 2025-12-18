import { getSafeUser } from './../helpers/safeUser';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { generateToken } from 'src/helpers/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) throw new BadRequestException('Invalid credentials');

    const isPasswordEqual = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordEqual) throw new BadRequestException('Invalid credentials');

    const safeUser = getSafeUser(user);
    const accessToken = generateToken(safeUser)

    return {accessToken, user: safeUser};
  }
}
