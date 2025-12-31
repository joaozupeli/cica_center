
import { JwtStrategy } from '@config/authentication/jwt.strategy';
import Usuario from '@models/usuario.model';
import { AuthenticationController } from './authentication.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthenticationService } from './authentication.service';

@Module({
    controllers: [AuthenticationController],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.APP_SECRET,
        signOptions: { expiresIn: `${process.env.APP_EXPIRE_TOKEN}s` },
      }),
    }),
    SequelizeModule.forFeature([Usuario]),
  ],
  providers: [AuthenticationService, JwtStrategy],
})
export class AuthenticationModule {}
