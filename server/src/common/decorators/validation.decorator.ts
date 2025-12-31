import { Type } from 'class-transformer';
import {
  ArrayNotEmpty as _ArrayNotEmpty,
  IsArray as _IsArray,
  IsBoolean as _IsBoolean,
  // IsEmail as _IsEmail,
  IsDateString as _IsDateString,
  IsNotEmpty as _IsNotEmpty,
  IsNotEmptyObject as _IsNotEmptyObject,
  IsNumber as _IsNumber,
  IsNumberString as _IsNumberString,
  IsObject as _IsObject,
  IsString as _IsString,
  Length as _Lenght,
  MaxLength as _MaxLength,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export const IsNotEmpty = () => _IsNotEmpty({ message: 'O campo $property é obrigatório!' });
export const IsString = () => _IsString({ message: 'O campo $property deverá ser string!' });
export const IsBoolean = () => _IsBoolean({ message: 'O campo $property deverá ser booleano!' });
export const IsNumber = () => _IsNumber({ allowNaN: false }, { message: 'O campo $property não é um número válido!' });
export const IsNumberString = () =>
  _IsNumberString({ no_symbols: false }, { message: 'O campo $property não é um número válido!' });
export const IsObject = () => _IsObject({ message: 'O campo $property deverá ser um objeto!' });
export const IsArray = () => _IsArray({ message: 'O campo $property deverá ser um array!' });
export const IsDateString = () =>
  _IsDateString({ strict: false }, { message: 'O campo $property não é uma data válida!' });
// export const IsEmail = () => _IsEmail({ message: 'O campo $property deverá ser um e-mail válido!' });
export const IsNotEmptyObject = () =>
  _IsNotEmptyObject({ nullable: false }, { message: 'O campo $property não poderá ser vazio!' });
export const ArrayNotEmpty = () => _ArrayNotEmpty({ message: 'O campo $property não poderá ser vazio!' });
export const MaxLength = (valorMaximo: number) =>
  _MaxLength(valorMaximo, { message: 'O campo $property deve ter no máximo: $constraint1 caracteres!' });
export const Length = (valor: number, minimo?: number) =>
  _Lenght(valor, minimo, { message: 'O campo $property deve ter: $constraint1 caracteres!' });

export { IsOptional, Type, ValidateIf, ValidateNested };
