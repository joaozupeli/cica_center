import { AllowNull, Column, DataType, DeletedAt, Model } from 'sequelize-typescript';

export class ModelBase extends Model {
  @Column(DataType.STRING(50))
  createdBy: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: string;

  @Column(DataType.STRING(50))
  updatedBy: string;

  @Column(DataType.DATE)
  updatedAt: string;

  @Column(DataType.STRING(50))
  deletedBy: string;

  @DeletedAt
  deletedAt: string;
}
