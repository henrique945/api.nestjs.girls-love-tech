//#region Imports

import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../common/base-entity';

//#endregion

/**
 * A classe que representa a entidade que lida com os usuários
 */
@Entity('user')
export class UserEntity extends BaseEntity {

  //#region Constructor

  constructor(partial: Partial<UserEntity>) {
    super();

    Object.assign(this, partial);
  }

  //#endregion

  //#region Properties

  /**
   * O e-mail do usuário
   */
  @Column({ nullable: false, unique: true })
  public email: string;

  /**
   * A senha do usuário
   */
  @Column({ nullable: false })
  @Exclude()
  public password: string;

  /**
   * O nome do usuário
   */
  @Column({ nullable: false })
  public name: string;

  /**
   * As permissões desse usuário
   */
  @Column({ nullable: false })
  public roles: string;

  //#endregion

}
