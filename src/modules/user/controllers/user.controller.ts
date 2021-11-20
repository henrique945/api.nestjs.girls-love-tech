//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Get, Param, Request, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudRequest, GetManyDefaultResponse, Override, ParsedRequest } from '@nestjsx/crud';
import { BaseCrudController } from '../../../common/base-crud.controller';
import { ProtectTo, UnprotectedRoute } from '../../../decorators/protect/protect.decorator';
import { User } from '../../../decorators/user/user.decorator';
import { NestJSRequest } from '../../../utils/type.shared';
import { RolesEnum } from '../../auth/models/roles.enum';
import { UserEntity } from '../entities/user.entity';
import { CreateUserPayload } from '../models/create-user.payload';
import { UpdateUserPayload } from '../models/update-user.payload';
import { UserService } from '../services/user.service';

//#endregion

/**
 * A classe que representa o controlador que lida com os usuários
 */
@ApiBearerAuth()
@Crud({
  model: {
    type: UserEntity,
  },
  query: {
    exclude: ['password'],
  },
  routes: {
    exclude: [
      'updateOneBase',
      'createManyBase',
    ],
  },
})
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@Controller('user')
export class UserController extends BaseCrudController<UserEntity, UserService> {

  //#region Constructor

  constructor(
    service: UserService,
  ) {
    super(service);
  }

  //#endregion

  //#region Functions

  /**
   * Método que retorna as informações do usuário que esteja logado
   *
   * @param user As informações do usuário que está fazendo a requisição
   */
  @Get('me')
  @ApiOperation({ summary: 'Get my info.' })
  @ApiOkResponse({ description: 'Get my info.', type: UserEntity })
  @ProtectTo(RolesEnum.USER, RolesEnum.ADMIN)
  public async getMe(@User() user: UserEntity): Promise<UserEntity> {
    return await this.service.getMe(user);
  }

  /**
   * Método que retorna várias informações da entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: UserEntity })
  public async getMany(@User() requestUser: UserEntity, @ParsedRequest() crudRequest: CrudRequest): Promise<UserEntity[] | GetManyDefaultResponse<UserEntity>> {
    return await this.service.listMany(requestUser, crudRequest);
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param id A identificação da entidade que está sendo procurada
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo(RolesEnum.USER, RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: UserEntity })
  public async getOne(@User() requestUser: UserEntity, @Param('id') id: string, @ParsedRequest() crudRequest: CrudRequest): Promise<UserEntity> {
    return await this.service.get(requestUser, +id, crudRequest);
  }

  /**
   * Método que cria uma nova entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param payload As informações para a criação da entidade
   */
  @UnprotectedRoute()
  @Override()
  @ApiOkResponse({ type: UserEntity })
  public createOne(@User() requestUser: UserEntity, @Body() payload: CreateUserPayload): Promise<UserEntity> {
    return this.service.create(requestUser, payload);
  }

  /**
   * Método que atualiza uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  @ProtectTo(RolesEnum.USER, RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: UserEntity })
  public async replaceOne(@User() requestUser: UserEntity, @Param('id') entityId: string, @Body() payload: UpdateUserPayload): Promise<UserEntity> {
    return await this.service.update(requestUser, +entityId, payload);
  }

  /**
   * Método que deleta uma entidade
   *
   * @param nestRequest As informações da requisição do NestJS
   */
  @ProtectTo(RolesEnum.USER, RolesEnum.ADMIN)
  @Override()
  public async deleteOne(@Request() nestRequest: NestJSRequest): Promise<UserEntity> {
    return await this.service.delete(nestRequest);
  }

  //#endregion

}
