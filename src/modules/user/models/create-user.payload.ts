//#region Imports

import { ApiProperty } from '@nestjs/swagger';

import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';

import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * As informações enviadas para criar um usuário
 */
export class CreateUserPayload {

  @ApiProperty()
  @IsDefined({ message: 'É necessário informar o e-mail.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsEmail({}, { message: DefaultValidationMessages.IsEmail })
  public email: string;

  @ApiProperty()
  @IsDefined({ message: 'É necessário informar a senha.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public password: string;

  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar um nome.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public name: string;

  @ApiProperty({ description: 'Apenas administrador pode mudar esta propriedade.' })
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public roles?: string;

}
