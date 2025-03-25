import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  const config = new DocumentBuilder()
    .setTitle('Campaign Reports')
    .setDescription('Campaign Reports API')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  const port = configService.apiApp.port ?? 9090;
  await app.listen(port);
}
bootstrap()
  .then(() => {
    console.log('Hello from API service!');
  })
  .catch((err) => {
    console.error(err);
  });
