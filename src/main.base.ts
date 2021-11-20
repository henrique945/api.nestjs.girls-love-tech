/* tslint:disable:ordered-imports */
// @formatter:off

//#region Imports

import { INestApplication, RequestTimeoutException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CrudConfigService } from '@nestjsx/crud';

import * as express from 'express';
import { Express, Request, Response } from 'express';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
import { envConfig } from './modules/env/env.module';
import { EnvService } from './modules/env/services/env.service';

const bodyParser = require('body-parser');

//#endregion

//#region Transactional

initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();

//#endregion

//#region Configurations

CrudConfigService.load({
  query: {
    limit: envConfig.CRUD_LIMIT,
    maxLimit: envConfig.CRUD_MAX_LIMIT,
    cache: envConfig.CRUD_CACHE,
    alwaysPaginate: envConfig.CRUD_ALWAYS_PAGINATE,
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  routes: {
    exclude: ['replaceOneBase'],
    updateOneBase: {
      allowParamsOverride: true,
    },
    deleteOneBase: {
      returnDeleted: false,
    },
  },
});

// Deixar abaixo desse CRUD, é necessário para que funcione
const AppModule = require('./app.module').AppModule;

//#endregion

//#region Setup Methods

/**
 * Método que configura o Swagger para a aplicação
 *
 * @param app A instância da aplicação
 * @param env As configurações da aplicação
 */
function setupSwagger(app: INestApplication, env: EnvService): void {
  if (!env.SWAGGER_ENABLED)
    return;

  const swaggerOptions = new DocumentBuilder()
    .setTitle(env.SWAGGER_TITLE)
    .setDescription(env.SWAGGER_DESCRIPTION)
    .setVersion(env.SWAGGER_VERSION)
    .addTag(env.SWAGGER_TAG)
    .setBasePath(env.SWAGGER_BASE_PATH)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup(`${ env.API_BASE_PATH }/swagger`, app, document);
}

/**
 * Método que configura os pipes globais
 *
 * @param app A instância da aplicação
 */
function setupPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
}

/**
 * Método que configura os middleware da aplicação
 *
 * @param app A instância da aplicação
 * @param env As configurações da aplicação
 */
function setupMiddleware(app: INestApplication, env: EnvService): void {
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());

  app.enableCors();

  app.use(bodyParser.json({
    limit: '50mb',
  }));

  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  }));

  app.use((req: Request, res: Response, next) => {
    if (req.url === '/media/upload/image')
      return next();

    res.setTimeout(env.API_TIMEOUT, () => {
      next(new RequestTimeoutException('A requisição durou tempo demais.'));
    });

    next();
  });

  if (env.isTest)
    return;

  app.use(
    rateLimit({
      windowMs: env.API_RATE_LIMIT_WINDOW_MS, // 1 minute
      max: env.API_RATE_LIMIT_MAX, // limit each IP to 100 requests per windowMs,
      message: {
        statusCode: 429,
        timestamp: new Date().toISOString(),
        message: 'Você fez muitas requisições em um periodo de tempo muito curto, por favor, aguarde uns instantes para você realizar outra requisição.',
        error: 'TooManyRequest',
      } as any,
    }),
  );
}

//#endregion

export async function createApp(): Promise<INestApplication> {
  const expressApp = express();

  return createAppInit(expressApp);
}

export async function createAppInit(expressApp: Express): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['log', 'verbose', 'debug', 'error', 'warn'],
  });

  await setup(app);

  return app;
}

export async function setup(app: INestApplication): Promise<INestApplication> {
  const env = await app.get(EnvService);

  setupSwagger(app, env);
  setupPipes(app);
  setupMiddleware(app, env);

  app.setGlobalPrefix(env.API_BASE_PATH);

  return app;
}
