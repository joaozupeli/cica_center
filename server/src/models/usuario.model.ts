import { ModelBase } from '@config/database/model_base';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import EmpresaModel from './empresa.model';
import PerfilModel from './perfil.model';

export enum UsuarioAtivo {
  Sim = 1,
  Nao = 0
}
@Table({ tableName: 'usuario' })
export default class UsuarioModel extends ModelBase {
  @AllowNull(true)
  @Column(DataType.STRING(255))
  nome: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  login: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  senha: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  empresaId: number;

  @BelongsTo(() => EmpresaModel, { foreignKey: 'empresaId' })
  empresa: EmpresaModel;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  ativo: UsuarioAtivo;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => PerfilModel)
  perfilId: number;

  @BelongsTo(() => PerfilModel, { foreignKey: 'perfilId' })
  perfil: PerfilModel;
}
