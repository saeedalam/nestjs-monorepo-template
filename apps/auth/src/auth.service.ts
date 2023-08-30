import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { GenerateProductKeyDto } from './dto/create.productkey.dto';
import { DatabaseService } from '@app/common/database/database.service';
import { SigninDto } from './dto/signin.dto';

interface SingupParams {
  email: string;
  name: string;
  password: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: DatabaseService) {}

  async signup({ email, password, phone, name }: SingupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) new ConflictException();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        phone,
        name,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });

    return await this.generateJwtToken(name, user.id, UserType.BUYER);
  }

  async signin({ email, password }: SigninDto) {
    console.log({ email, password });
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.CONFLICT);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new HttpException('Invalid cerdentials', 400);

    return this.generateJwtToken(user.name, user.id, user.user_type);
  }

  async generateJwtToken(name: string, id: string, userType: UserType) {
    return {
      token: jwt.sign(
        {
          name: name,
          id: id,
          role: userType,
        },
        process.env.JSON_TOKEN_KEY,
        {
          expiresIn: 36000000,
        },
      ),
    };
  }

  async generateKey({ email, userType }: GenerateProductKeyDto) {
    const key = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(key, 10);
  }
}
