//#region Imports

import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';

import { Repository } from 'typeorm';

import { BaseCrudService } from '../../../common/base-crud.service';
import { isAdminUser } from '../../../utils/functions';
import { encryptPassword } from '../../../utils/password';
import { NestJSRequest } from '../../../utils/type.shared';
import { getCleanedEmail } from '../../../utils/xss';
import { RolesEnum } from '../../auth/models/roles.enum';
import { UserEntity } from '../entities/user.entity';
import { CreateUserPayload } from '../models/create-user.payload';
import { UpdateUserPayload } from '../models/update-user.payload';

//#endregion

/**
 * A classe que representa o serviço que lida com os usuários
 */
@Injectable()
export class UserService extends BaseCrudService<UserEntity> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    @InjectRepository(UserEntity)
    public repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  //#endregion

  //#region Functions

  /**
   * Método que retorna as informações do usuário logado
   */
  public async getMe(requestUser: UserEntity): Promise<UserEntity> {
    return await this.findOne({ where: { id: requestUser.id } });
  }

  /**
   * Método que retorna uma lista com as entidades
   *
   * @param requestUser As informações do usuário da requisição
   * @param crudRequest As informações da requisição do CRUD
   */
  public async listMany(requestUser: UserEntity, crudRequest: CrudRequest): Promise<UserEntity[] | GetManyDefaultResponse<UserEntity>> {
    if (isAdminUser(requestUser))
      return await this.getMany(crudRequest);

    throw new ForbiddenException('Você não tem permissão para listar todos os usuários.');
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param crudRequest As informações da requisição do CRUD
   */
  public async get(requestUser: UserEntity, entityId: number, crudRequest?: CrudRequest): Promise<UserEntity> {
    let entity: UserEntity;

    if (crudRequest)
      entity = await this.getOne(crudRequest);
    else
      entity = await this.findOne({ where: { id: entityId } });

    if (!entity)
      throw new NotFoundException(`A entidade procurada pela identificação (${ entityId }) não foi encontrada.`);

    if (entityId === requestUser.id)
      return entity;

    if (isAdminUser(requestUser))
      return entity;

    throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');
  }

  /**
   * Método que cria uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param payload As informações para a criação
   */
  public async create(requestUser: UserEntity, payload: CreateUserPayload): Promise<UserEntity> {
    const alreadyHasUser = await this.hasUserWithEmail(payload.email);

    if (alreadyHasUser)
      throw new BadRequestException('Já existe um usuário cadastrado com esse e-mail.');

    if (!requestUser.roles.includes(RolesEnum.ADMIN))
      payload.roles = 'user';

    if (!payload.roles)
      payload.roles = 'user';

    if (!payload.password)
      throw new BadRequestException('Não foi enviada uma senha.');

    payload.password = await encryptPassword(payload.password);

    return await this.repository.save(payload);
  }

  /**
   * Método que atualiza as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  public async update(requestUser: UserEntity, entityId: number, payload: UpdateUserPayload): Promise<UserEntity> {
    if (!requestUser.roles.includes(RolesEnum.ADMIN))
      payload.roles = 'user';

    const alreadyHasUser = await this.hasUserWithEmail(payload.email);

    if (alreadyHasUser)
      throw new BadRequestException('Já existe um usuário cadastrado com esse e-mail.');

    if (entityId === requestUser.id)
      return await this.repository.save(payload);

    if (isAdminUser(requestUser))
      return await this.repository.save(payload);

    throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');
  }

  /**
   * Método para deletar um usuário
   */
  public async delete(request: NestJSRequest): Promise<UserEntity> {
    if (!request.user.roles.includes('admin'))
      throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');

    const user = await this.findOne({ where: { id: request.params.id } });

    user.isActive = false;

    return await this.repository.save(user);
  }

  /**
   * Método que verificar se o email já foi cadastrado no banco
   */
  private async hasUserWithEmail(email: string): Promise<boolean> {
    email = getCleanedEmail(email);

    return await this.count({ where: { email } }).then(count => count > 0);
  }

  //#endregion

}
