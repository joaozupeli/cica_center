import { Ip } from "@common/decorators/ip.decorator";
import { Public } from "@common/decorators/public.decorator";
import { AuthenticationService } from "@modules/authentication/authentication.service";
import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import {
  AutenticacaoAlterarSenhaDto,
  AutenticacaoLoginDto,
} from "./authentication.dto";

@Controller("autenticacao")
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Public()
  @Post("login")
  login(
    @Body() autenticacaoLoginDto: AutenticacaoLoginDto,
    @Headers("user-agent") agente: string,
    @Ip() ip: string
  ) {
    return this.authenticationService.login(autenticacaoLoginDto, agente, ip);
  }

  @Public()
  @Post("logout")
  logout(@Headers("Authorization") token: string) {
    return this.authenticationService.logout(token);
  }

  @Public()
  @Post("alterar-senha")
  alterarSenha(
    @Body() autenticacaoAlterarSenhaDto: AutenticacaoAlterarSenhaDto
  ) {
    return this.authenticationService.alterarSenha(autenticacaoAlterarSenhaDto);
  }
}
