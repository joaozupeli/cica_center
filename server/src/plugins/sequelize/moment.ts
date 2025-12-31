import { DataType } from 'sequelize-typescript';

export default function sequelizeMoment(format: string) {
  DataType.DATE.prototype._stringify = function _stringify(date: any, options: any) {
    return this._applyTimezone(date, options);
  };
}
