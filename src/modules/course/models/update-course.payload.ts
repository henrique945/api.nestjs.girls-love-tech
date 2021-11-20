//#region Imports

import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * As informações enviadas para atualizar um curso
 */
export class UpdateCoursePayload {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  public rating?: number;

}
