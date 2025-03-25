export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface AppConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
}

export interface ProbationApiClientConfig {
  baseUrl: string;
  apiKey: string;
  pageSize: number;
}
