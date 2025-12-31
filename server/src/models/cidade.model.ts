import { ModelBase } from '@config/database/model_base';
import { AllowNull, BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import EstadoModel from './estado.model';

@Table({ tableName: 'cidade' })
export default class CidadeModel extends ModelBase {  
  @AllowNull(false)
  @Column(DataType.STRING(250))
  descricao: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  codigoIbge: number;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  estadoId: number;

  @BelongsTo(() => EstadoModel, { foreignKey: 'estadoId' })
  estado: EstadoModel;
}
