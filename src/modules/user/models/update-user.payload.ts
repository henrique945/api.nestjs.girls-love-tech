//#region Imports

import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsOptional, IsString } from 'class-validator';
import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * As informações enviadas para atualizar um usuário
 */
export class UpdateUserPayload {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsEmail({}, { message: DefaultValidationMessages.IsEmail })
  public email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public name?: string;

  @ApiPropertyOptional({ description: 'Only admins can change this property.' })
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public roles?: string;

}
