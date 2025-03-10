import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  
  await app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log("server is listening on port", process.env.SERVER_PORT);
  });
}
bootstrap();
