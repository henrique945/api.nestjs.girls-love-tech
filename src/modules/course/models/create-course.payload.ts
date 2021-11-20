//#region Imports

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * As informações enviadas para criar um curso
 */
export class CreateCoursePayload {

  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar um nome.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  public rating?: number;

}
