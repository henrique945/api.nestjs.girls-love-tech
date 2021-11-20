//#region Imports

import { ApiProperty } from '@nestjs/swagger';

import { IsDefined, IsNumber, IsString } from 'class-validator';

import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * As informações enviadas para criar um aula
 */
export class CreateLessonPayload {

  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar um nome.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public name: string;

  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar a ordem da aula.' })
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  public order: number;

  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar o url do video.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public videoUrl: string;

  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar o id do curso..' })
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  public courseId: number;

}
