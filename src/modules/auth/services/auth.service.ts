//#region  Imports

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { TokenProxy } from '../../../models/proxys/token.proxy';
import { getCleanedEmail } from '../../../utils/xss';
import { EnvService } from '../../env/services/env.service';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { IJwtPayload } from '../models/jwt.payload';
import { LoginPayload } from '../models/login.payload';
import { IRefreshJwtPayload } from '../models/refresh-jwt.payload';

const ms = require('ms');

//#endregion

/**
 * A classe que representa o serviço que lida com as autenticações
 */
@Injectable()
export class AuthService {

  //#region  Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly env: EnvService,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que realiza o login de um usuário
   *
   * @param user As informações do usuário
   * @param expiresInMilliseconds Diz quando o token deve ser expirado
   */
  public async signIn(user: Partial<UserEntity>, expiresInMilliseconds?: number): Promise<TokenProxy> {
    const { id, roles, createdAt, updatedAt, isActive } = user;
    const expiresIn = expiresInMilliseconds && ms(expiresInMilliseconds) || this.env.JWT_EXPIRES_IN;
    const refreshExpireIn = ms(ms(expiresIn) * 2);

    const token = await this.jwtService.signAsync({
      id,
      roles,
      createdAt,
      updatedAt,
      isActive,
    }, { expiresIn });

    const refreshToken = await this.jwtService.signAsync({
      refreshId: id,
      roles: 'refreshjwt',
      createdAt,
      updatedAt,
      isActive,
    }, { expiresIn: refreshExpireIn });

    return new TokenProxy(token, expiresIn, refreshToken, refreshExpireIn);
  }

  /**
   * Método que realiza a autenticação de um usuário
   *
   * @param email O endereço de e-mail do usuário
   * @param passwordWithoutEncryption A senha do usuário
   */
  public async authenticate({ username, password: passwordWithoutEncryption }: LoginPayload): Promise<Partial<UserEntity>> {
    const email = getCleanedEmail(username);
    const { password, ...user } = await this.userService.findOne({ where: { email } });

    const passwordIsMatch = await bcryptjs.compare(passwordWithoutEncryption, password);

    if (!passwordIsMatch)
      throw new UnauthorizedException('A senha ou o e-mail enviado estão incorretos.');

    return user;
  }

  /**
   * Método que valida um usuário com o base no payload extraido do token
   *
   * @param jwtPayload As informações extraidas do token
   */
  public async validateUserByPayload(jwtPayload: IJwtPayload): Promise<UserEntity> {
    if (!jwtPayload)
      throw new UnauthorizedException('As informações para a autenticação não foram encontradas.');

    if (!jwtPayload.iat || !jwtPayload.exp || !jwtPayload.id)
      throw new UnauthorizedException('Os detalhes para a autenticação não foram encontrados.');

    const now = Date.now().valueOf() / 1000;
    const jwtExpiresIn = jwtPayload.exp;

    if (now > jwtExpiresIn)
      throw new UnauthorizedException('O token de autenticação está expirado.');

    const user = await this.userService.findOne({ where: { id: jwtPayload.id } });

    if (user === null)
      throw new UnauthorizedException('Você não tem mais permissão para realizar essa ação, seu usuário foi desativado ou removido.');

    return user;
  }

  /**
   * Método que valida um usuário com o base no payload extraido do token de atualização
   *
   * @param jwtPayload As informações extraídas do token
   */
  public async validateUserForRefreshTokenByPayload(jwtPayload: IRefreshJwtPayload): Promise<UserEntity> {
    if (!jwtPayload)
      throw new UnauthorizedException('As informações para a autenticação não foram encontradas.');

    if (!jwtPayload.iat || !jwtPayload.exp || !jwtPayload.refreshId)
      throw new UnauthorizedException('Os detalhes para a autenticação não foram encontrados.');

    const now = Date.now().valueOf() / 1000;
    const jwtExpiresIn = jwtPayload.exp;

    if (now > jwtExpiresIn)
      throw new UnauthorizedException('O token de autenticação está expirado.');

    const user = await this.userService.findOne({ where: { id: jwtPayload.refreshId } });

    if (user === null)
      throw new UnauthorizedException('Você não tem mais permissão para realizar essa ação, seu usuário foi desativado ou removido.');

    user.roles = 'refreshjwt';

    return user;
  }

  //#endregion

}
