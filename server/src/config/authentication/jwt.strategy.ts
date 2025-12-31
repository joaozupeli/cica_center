import Usuario from "@models/usuario.model";
import { AuthenticationDto } from "@modules/authentication/authentication.dto";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectModel } from "@nestjs/sequelize";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Usuario)
    private usuarioModel: typeof Usuario
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_SECRET,
    });
  }

  /**
   * @author João Zupeli
   *
   * @description Valida informações de token do usuário
   *
   * @param {any} payload
   *
   * @memberof AuthenticationService
   */
  async validate(payload: any) {
    return {
      ...payload.sub,
      type: AuthenticationDto.Usuario,
    };
  }
}
