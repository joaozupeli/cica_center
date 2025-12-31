import { ModelBase } from '@config/database/model_base';
import { AllowNull, Column, DataType, Table } from 'sequelize-typescript';

@Table({ tableName: 'perfil' })
export default class PerfilModel extends ModelBase {  
  @AllowNull(false)
  @Column(DataType.STRING(250))
  descricao: string;
}
