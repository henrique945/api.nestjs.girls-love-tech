//#region Imports

import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../common/base-entity';
import { LessonEntity } from '../../lesson/entities/lesson.entity';

//#endregion

/**
 * A classe que representa a entidade que lida com os cursos
 */
@Entity('course')
export class CourseEntity extends BaseEntity {

  //#region Constructor

  constructor(partial: Partial<CourseEntity>) {
    super();

    Object.assign(this, partial);
  }

  //#endregion

  //#region Properties

  /**
   * O nome do curso
   */
  @Column({ nullable: false })
  public name: string;

  /**
   * A avaliação do curso
   */
  @Column({ nullable: true, type: 'float' })
  public rating?: number;

  /**
   * Joins
   */
  @OneToMany(u => LessonEntity, lessons => lessons.course)
  public lessons: LessonEntity[];

  //#endregion

}
