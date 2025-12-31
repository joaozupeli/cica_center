import Usuario, { UsuarioAtivo } from "@models/usuario.model";
import {
  AutenticacaoAlterarSenhaDto,
  AutenticacaoLoginDto,
  AuthenticationDto,
} from "./authentication.dto";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import * as CryptoJS from "crypto-js";
import dayjs from "dayjs";

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,

    @InjectModel(Usuario)
    private usuarioModel: typeof Usuario
  ) {}

  async login(
    autenticacaoLoginDto: AutenticacaoLoginDto,
    agente: string,
    ip: string
  ) {
    const msgGenerica = "Usuário e/ou senha inválidos!";

    const usuario = await this.usuarioModel.findOne({
      where: {
        login: autenticacaoLoginDto.login,
      },
      order: [["ativo", "DESC"]],
    });

    if (!usuario) {
      throw new Error(msgGenerica);
    }

    if (usuario.ativo !== UsuarioAtivo.Sim) {
      throw new Error("Usuario não encontrato. Entre em contato com a T.I");
    }

    if (autenticacaoLoginDto.senha !== usuario.senha) {
      throw new Error(msgGenerica);
    }

    if (usuario.senha === CryptoJS.HmacSHA256("1234", "123").toString()) {
      return {
        id: usuario.id,
        senhaVencida: true,
      };
    }

    // TODO: Tokenizar o login

    let token: string;
    token = await this.jwtService.signAsync({
      type: AuthenticationDto.Usuario,
      login: usuario.login,
      empresaId: usuario.empresaId,
      sub: {
        id: usuario.id,
        ativo: usuario.ativo,
        login: usuario.login,
        nome: usuario.nome,
        empresaId: usuario.empresaId,
      },
      agente,
      ip,
    });

    return {
      nome: usuario.nome,
      empresaId: usuario.empresaId,
      perfilId: usuario.perfilId,
      token,
      expires_in: process.env.APP_EXPIRE_TOKEN,
    };
  }

  async logout(token: string) {
    token = token.replace("Bearer ", "");

    await this.jwtService.verifyAsync(token);

    const tokenInfo: any = this.jwtService.decode(token);

    if (!tokenInfo) {
      throw new Error("Falha ao identificar informações de autenticação!");
    }

    return { mensagem: "Logout efetuado com sucesso!" };
  }

  async alterarSenha(payload: AutenticacaoAlterarSenhaDto) {
    const msgGenerica = "Usuário e/ou senha inválidos!";

    const usuarioDb = await this.usuarioModel.findOne({
      where: {
        login: payload.login,
      },
      order: [["ativo", "DESC"]],
    });

    if (!usuarioDb) {
      throw new Error(msgGenerica);
    }

    if (usuarioDb.ativo !== UsuarioAtivo.Sim) {
      throw new Error(msgGenerica);
    }

    if (payload.senhaAtual !== usuarioDb.senha) {
      throw new Error("Senha atual informada é inválida!");
    }

    // if (payload.senhaAtual === payload.novaSenha) {
    //   throw new Error('Nova senha não pode ser igual a senha atual!');
    // }

    if (payload.confirmarNovaSenha !== payload.novaSenha) {
      throw new Error("Nova senha não confere com a confirmação de senha!");
    }

    await usuarioDb.update({
      senha: payload.novaSenha,
      vencimentoSenha: dayjs().add(3, "month").format("YYYY-MM-DD HH:mm:ss"),
    });

    return { mensagem: "Senha alterada com sucesso!" };
  }
}
