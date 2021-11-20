//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Param, Request, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudRequest, GetManyDefaultResponse, Override, ParsedRequest } from '@nestjsx/crud';
import { BaseCrudController } from '../../../common/base-crud.controller';
import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { User } from '../../../decorators/user/user.decorator';
import { NestJSRequest } from '../../../utils/type.shared';
import { RolesEnum } from '../../auth/models/roles.enum';
import { LessonEntity } from '../entities/lesson.entity';
import { CreateLessonPayload } from '../models/create-lesson.payload';
import { UpdateLessonPayload } from '../models/update-lesson.payload';
import { LessonService } from '../services/lesson.service';

//#endregion

/**
 * A classe que representa o controlador que lida com as aulas
 */
@ApiBearerAuth()
@Crud({
  model: {
    type: LessonEntity,
  },
  routes: {
    exclude: [
      'updateOneBase',
      'createManyBase',
    ],
  },
})
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('lesson')
@Controller('lesson')
export class LessonController extends BaseCrudController<LessonEntity, LessonService> {

  //#region Constructor

  constructor(
    service: LessonService,
  ) {
    super(service);
  }

  //#endregion

  //#region Functions

  /**
   * Método que retorna várias informações da entidade
   *
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo(RolesEnum.ADMIN, RolesEnum.USER)
  @Override()
  @ApiOkResponse({ type: LessonEntity })
  public async getMany(@ParsedRequest() crudRequest: CrudRequest): Promise<LessonEntity[] | GetManyDefaultResponse<LessonEntity>> {
    return await this.service.listMany(crudRequest);
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param id A identificação da entidade que está sendo procurada
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo(RolesEnum.ADMIN, RolesEnum.USER)
  @Override()
  @ApiOkResponse({ type: LessonEntity })
  public async getOne(@User() requestUser: LessonEntity, @Param('id') id: string, @ParsedRequest() crudRequest: CrudRequest): Promise<LessonEntity> {
    return await this.service.get(requestUser, id, crudRequest);
  }

  /**
   * Método que cria uma nova entidade
   *
   * @param payload As informações para a criação da entidade
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: LessonEntity })
  public createOne(@Body() payload: CreateLessonPayload): Promise<LessonEntity> {
    return this.service.create(payload);
  }

  /**
   * Método que atualiza uma entidade
   *
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: LessonEntity })
  public async replaceOne(@Param('id') entityId: string, @Body() payload: UpdateLessonPayload): Promise<LessonEntity> {
    return await this.service.update(+entityId, payload);
  }

  /**
   * Método que deleta uma entidade
   *
   * @param entityId A identificação da entidade que está sendo procurada
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  public async deleteOne(@Param('id') entityId: string): Promise<LessonEntity> {
    return await this.service.delete(+entityId);
  }

  //#endregion

}
