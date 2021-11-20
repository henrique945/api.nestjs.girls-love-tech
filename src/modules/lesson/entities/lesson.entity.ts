//#region Imports

import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../common/base-entity';
import { CourseEntity } from '../../course/entities/course.entity';

//#endregion

/**
 * A classe que representa a entidade que lida com as aulas
 */
@Entity('lesson')
export class LessonEntity extends BaseEntity {

  //#region Constructor

  constructor(partial: Partial<LessonEntity>) {
    super();

    Object.assign(this, partial);
  }

  //#endregion

  //#region Properties

  /**
   * O nome da aula
   */
  @Column({ nullable: false })
  public name: string;

  /**
   * A ordem da aula
   */
  @Column({ nullable: false })
  public order: number;

  /**
   * O Url do video da aula
   */
  @Column({ nullable: false })
  public videoUrl: string;

  /**
   * O id do curso associado
   */
  @Column({ nullable: false })
  public courseId: number;

  /**
   * Joins
   */
  @ManyToOne(u => CourseEntity, course => course.lessons)
  public course: CourseEntity;

  //#endregion

}
