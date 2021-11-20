//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Param, Request, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudRequest, GetManyDefaultResponse, Override, ParsedRequest } from '@nestjsx/crud';
import { BaseCrudController } from '../../../common/base-crud.controller';
import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { User } from '../../../decorators/user/user.decorator';
import { NestJSRequest } from '../../../utils/type.shared';
import { RolesEnum } from '../../auth/models/roles.enum';
import { CourseEntity } from '../entities/course.entity';
import { CreateCoursePayload } from '../models/create-course.payload';
import { UpdateCoursePayload } from '../models/update-course.payload';
import { CourseService } from '../services/course.service';

//#endregion

/**
 * A classe que representa o controlador que lida com os cursos
 */
@ApiBearerAuth()
@Crud({
  model: {
    type: CourseEntity,
  },
  routes: {
    exclude: [
      'updateOneBase',
      'createManyBase',
    ],
  },
})
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('course')
@Controller('course')
export class CourseController extends BaseCrudController<CourseEntity, CourseService> {

  //#region Constructor

  constructor(
    service: CourseService,
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
  @ApiOkResponse({ type: CourseEntity })
  public async getMany(@ParsedRequest() crudRequest: CrudRequest): Promise<CourseEntity[] | GetManyDefaultResponse<CourseEntity>> {
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
  @ApiOkResponse({ type: CourseEntity })
  public async getOne(@User() requestUser: CourseEntity, @Param('id') id: string, @ParsedRequest() crudRequest: CrudRequest): Promise<CourseEntity> {
    return await this.service.get(requestUser, id, crudRequest);
  }

  /**
   * Método que cria uma nova entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param payload As informações para a criação da entidade
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: CourseEntity })
  public createOne(@User() requestUser: CourseEntity, @Body() payload: CreateCoursePayload): Promise<CourseEntity> {
    return this.service.create(requestUser, payload);
  }

  /**
   * Método que atualiza uma entidade
   *
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: CourseEntity })
  public async replaceOne(@Param('id') entityId: string, @Body() payload: UpdateCoursePayload): Promise<CourseEntity> {
    return await this.service.update(+entityId, payload);
  }

  /**
   * Método que deleta uma entidade
   *
   * @param entityId A identificação da entidade que está sendo procurada
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  public async deleteOne(@Param('id') entityId: string): Promise<CourseEntity> {
    return await this.service.delete(+entityId);
  }

  //#endregion

}
