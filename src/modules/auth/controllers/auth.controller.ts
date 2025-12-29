import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDto } from '../dtos/create-token.dto';
import type { StringValue } from 'ms';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('token')
  createToken(@Body() body: CreateTokenDto) {
    const sub = body.sub ?? 'test-user';
    const clientId = body.clientId ?? Number(process.env.CLIENT_ID ?? 0);
    const expiresIn: StringValue = (body.expiresIn as StringValue) ??
      ((process.env.JWT_EXPIRATION as StringValue) ?? ('24h' as StringValue));

    const token = this.jwtService.sign({ sub, clientId }, { expiresIn });
    return { token };
  }
}
