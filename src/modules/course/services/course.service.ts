//#region Imports

import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';

import { Repository } from 'typeorm';

import { BaseCrudService } from '../../../common/base-crud.service';
import { LessonService } from '../../lesson/services/lesson.service';
import { CourseEntity } from '../entities/course.entity';
import { CreateCoursePayload } from '../models/create-course.payload';
import { UpdateCoursePayload } from '../models/update-course.payload';

//#endregion

/**
 * A classe que representa o serviço que lida com os cursos
 */
@Injectable()
export class CourseService extends BaseCrudService<CourseEntity> {

  //#region Constructor

  constructor(
    @InjectRepository(CourseEntity)
    public repository: Repository<CourseEntity>,
    @Inject(forwardRef(() => LessonService))
    private readonly lessonService: LessonService,
  ) {
    super(repository);
  }

  //#endregion

  //#region Functions

  /**
   * Método que retorna uma lista com as entidades
   *
   * @param crudRequest As informações da requisição do CRUD
   */
  public async listMany(crudRequest: CrudRequest): Promise<CourseEntity[] | GetManyDefaultResponse<CourseEntity>> {
    return await this.getMany(crudRequest);
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param crudRequest As informações da requisição do CRUD
   */
  public async get(requestUser: CourseEntity, entityId: string, crudRequest?: CrudRequest): Promise<CourseEntity> {
    let entity: CourseEntity;

    if (crudRequest)
      entity = await this.getOne(crudRequest);
    else
      entity = await this.findOne({ where: { id: entityId } });

    if (!entity)
      throw new NotFoundException(`A entidade procurada pela identificação (${ entityId }) não foi encontrada.`);

    return entity;
  }

  /**
   * Método que cria uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param payload As informações para a criação
   */
  public async create(requestUser: CourseEntity, payload: CreateCoursePayload): Promise<CourseEntity> {
    return await this.repository.save(payload);
  }

  /**
   * Método que atualiza as informações de uma entidade
   *
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  public async update(entityId: number, payload: UpdateCoursePayload): Promise<CourseEntity> {
    const course = new CourseEntity(payload);
    course.id = entityId;

    return await this.repository.save(course);
  }

  /**
   * Método para deletar um usuário
   */
  public async delete(entityId: number): Promise<CourseEntity> {
    const course = await this.findOne({ where: { id: entityId } });

    const lessons = await this.lessonService.find({
      where: {
        courseId: course.id,
      },
    });

    if (lessons.length !== 0)
      throw new BadRequestException('É necessário excluir as aulas desse curso primeiro.');

    return await this.repository.remove(course);
  }

  //#endregion

}
