declare namespace dotenv {

  export interface IDotEnv {

    /**
     * O tipo de ambiente que está rodando a aplicação
     */
    NODE_ENV: string;

    /**
     * O tipo de banco de dados suportado
     */
    DB_TYPE: string;

    /**
     * O host para se conectar ao banco de dados
     */
    DB_HOST: string;

    /**
     * O url da conexão ao banco de dados
     */
    DATABASE_URL: string;

    /**
     * A porta para se conectar ao banco de dados
     */
    DB_PORT: number;

    /**
     * O usuário para se conectar ao banco de dados
     */
    DB_USER: string;

    /**
     * A senha para se conectar ao banco de dados
     */
    DB_PASSWORD: string;

    /**
     * O nonem do banco de dados
     */
    DB_DATABASE: string;

    /**
     * Diz se deve sincronizar o banco de dados automaticamente após uma mudança.
     */
    DB_SYNCHRONIZE: boolean;

    /**
     * Diz se deve rodar as migrations ao executar a API
     */
    DB_MIGRATIONS_RUN: boolean;

    /**
     * O tempo de timeout em milisegundos para uma conexão com o banco de dados.
     */
    DB_TIMEOUT: number;

    /**
     * Diz se deve habilitar os logs
     */
    DB_LOGGING: boolean;

    /**
     * Diz se deve habilitar habilitar a conexão SSL
     */
    DB_SSL: boolean;

    /**
     * A estratégia padrão de autenticação
     */
    API_DEFAULT_STRATEGY: string;

    /**
     * O url base para acessar a API.
     */
    API_BASE_PATH: string;

    /**
     * Diz se deve habilitar o log da aplicação
     */
    API_ENABLE_LOGGING: boolean;

    /**
     * A janela em milisegundos para a validação do Rate Limiting
     */
    API_RATE_LIMIT_WINDOW_MS: number;

    /**
     * A quantidade de requisições que pode fazer em uma janela de tempo
     */
    API_RATE_LIMIT_MAX: number;

    /**
     * Método que coloca um timeout para as requisições
     */
    API_TIMEOUT: number;

    /**
     * O número da porta que será executado a API
     */
    PORT: number;

    /**
     * O limite padrão de itens que podem ser buscados por vez
     */
    CRUD_LIMIT: number;

    /**
     * O limite de itens máximo que pode ser aplicado
     */
    CRUD_MAX_LIMIT: number;

    /**
     * O limite de itens máximo que podem serem cacheados
     */
    CRUD_CACHE: number;

    /**
     * Diz se deve sempre paginar os resultados
     */
    CRUD_ALWAYS_PAGINATE: boolean;

    /**
     * A chave secreta do JWT
     */
    JWT_SECRET_KEY: string;

    /**
     * Diz quando a chave de autenticação deve expirar
     */
    JWT_EXPIRES_IN: string;

    /**
     * O titulo que será usado para a API.
     */
    SWAGGER_TITLE: string;

    /**
     * Uma breve descrição da API
     */
    SWAGGER_DESCRIPTION: string;

    /**
     * A versão atual da API
     */
    SWAGGER_VERSION: string;

    /**
     * Uma simples tag para o Swagger, pode ser o mesmo do titulo
     */
    SWAGGER_TAG: string;

    /**
     * Diz se o Swagger está ativado
     */
    SWAGGER_ENABLED: boolean;

    /**
     * O url base para o Swagger
     */
    SWAGGER_BASE_PATH: string;

  }
}

declare type IDotEnv = dotenv.IDotEnv;
