import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);

  const config = new DocumentBuilder()
    .setTitle('Probation Worker')
    .setDescription('Probation Worker API')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const configService = app.get(ConfigService);
  const port = configService.workerApp.port ?? 9090;
  await app.listen(port);
}
bootstrap()
  .then(() => {
    console.log('Hello form Worker service!');
  })
  .catch((err) => {
    console.error(err);
  });
