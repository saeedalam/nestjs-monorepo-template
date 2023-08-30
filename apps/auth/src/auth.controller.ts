import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto } from './dto/create.productkey.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { UserInfo } from '@app/common/auth/interceptors/user-interceptor';
import { User } from '@app/common/auth/decorators/user-decorator';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  //Nice to have login as a role
  @Post('signup/:userType')
  async signupType(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }

      const validKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

      const isValidKey = await bcrypt.compare(validKey, body.productKey);
      if (!isValidKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signup(body);
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('key')
  key(@Body() body: GenerateProductKeyDto) {
    return this.authService.generateKey(body);
  }

  @Get('me')
  async me(@User() user: UserInfo) {
    return user;
  }
}
