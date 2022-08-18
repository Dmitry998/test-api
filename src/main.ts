import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Тестовое задание OUTSIDE DIGITAL')
        .setDescription('Документация по REST API')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;

    await app.listen(port, () => {
        console.log(`Приложение запустилось на порту: ${port}`);
    });
}
bootstrap();
