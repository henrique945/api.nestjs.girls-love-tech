//#region Imports

import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';

import { Repository } from 'typeorm';

import { BaseCrudService } from '../../../common/base-crud.service';
import { CourseService } from '../../course/services/course.service';
import { LessonEntity } from '../entities/lesson.entity';
import { CreateLessonPayload } from '../models/create-lesson.payload';
import { UpdateLessonPayload } from '../models/update-lesson.payload';

//#endregion

/**
 * A classe que representa o serviço que lida com as aulas
 */
@Injectable()
export class LessonService extends BaseCrudService<LessonEntity> {

  //#region Constructor

  constructor(
    @InjectRepository(LessonEntity)
    public repository: Repository<LessonEntity>,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
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
  public async listMany(crudRequest: CrudRequest): Promise<LessonEntity[] | GetManyDefaultResponse<LessonEntity>> {
    return await this.getMany(crudRequest);
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param crudRequest As informações da requisição do CRUD
   */
  public async get(requestUser: LessonEntity, entityId: string, crudRequest?: CrudRequest): Promise<LessonEntity> {
    let entity: LessonEntity;

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
   * @param payload As informações para a criação
   */
  public async create(payload: CreateLessonPayload): Promise<LessonEntity> {
    const course = await this.courseService.findOne({ where: { id: payload.courseId } });

    if (!course)
      throw new NotFoundException('Curso não encontrado.');

    return await this.repository.save(payload);
  }

  /**
   * Método que atualiza as informações de uma entidade
   *
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  public async update(entityId: number, payload: UpdateLessonPayload): Promise<LessonEntity> {
    const lesson = new LessonEntity(payload);
    lesson.id = entityId;

    if (payload.courseId) {
      const course = await this.courseService.findOne({ where: { id: payload.courseId } });

      if (!course)
        throw new NotFoundException('Curso não encontrado.');
    }

    return await this.repository.save(lesson);
  }

  /**
   * Método para deletar um usuário
   */
  public async delete(entityId: number): Promise<LessonEntity> {
    const lesson = await this.findOne({ where: { id: entityId } });

    return await this.repository.remove(lesson);
  }

  //#endregion

}
