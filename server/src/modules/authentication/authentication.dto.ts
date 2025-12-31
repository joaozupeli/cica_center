import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum AuthenticationDto {
  Usuario = 1,
  APP = 2,
}

export class AutenticacaoLoginDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}

export class AutenticacaoAlterarSenhaDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  senhaAtual: string;

  @IsString()
  @IsNotEmpty()
  novaSenha: string;

  @IsString()
  @IsNotEmpty()
  confirmarNovaSenha: string;
}

export class UsuarioDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  ativo: number;

  @IsNumber()
  @IsNotEmpty()
  codigo: number;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  empresaId: string;
}

export class VerificarUsuarioRotinaDto {
  @IsNumber()
  @IsOptional()
  rotina: number;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}

export class AtualizarLocalizacaoDto {
  @IsString()
  @IsOptional()
  ipLocal?: string;
}
