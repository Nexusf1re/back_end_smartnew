import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../common/guards/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import type { StringValue } from 'ms';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'change-this-in-production'),
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_EXPIRATION', '24h' as StringValue),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
