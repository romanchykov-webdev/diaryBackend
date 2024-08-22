import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware для обработки CORS
  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Разрешение отправки cookie и аутентификации через CORS
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'x-custom-header',
    ],
  });

  // Использование глобального валидационного пайпа
  app.useGlobalPipes(new ValidationPipe());

  // Создание Swagger документации
  const config = new DocumentBuilder()
    .setTitle('API testing documentation')
    .setDescription('This API is for testing documentation')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Получение порта из конфигурации
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  // Запуск приложения
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
