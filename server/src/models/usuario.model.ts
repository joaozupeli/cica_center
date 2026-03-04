import { ModelBase } from "@config/database/model_base";
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from "sequelize-typescript";
import PerfilModel from "@models/perfil.model";

@Table({ tableName: "usuario" })
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

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => PerfilModel)
  perfilId: number;

  @BelongsTo(() => PerfilModel, { foreignKey: "perfilId" })
  perfil: PerfilModel;
}
