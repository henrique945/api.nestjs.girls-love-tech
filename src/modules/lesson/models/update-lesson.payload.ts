//#region Imports

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * As informações enviadas para atualizar um aula
 */
export class UpdateLessonPayload {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  public order?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  public courseId?: number;

}
