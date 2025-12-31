import { ModelBase } from "@config/database/model_base";
import { AllowNull, Column, DataType, Table } from "sequelize-typescript";

@Table({ tableName: "estado" })
export default class EstadoModel extends ModelBase {
  @AllowNull(false)
  @Column(DataType.STRING(250))
  descricao: string;
}
