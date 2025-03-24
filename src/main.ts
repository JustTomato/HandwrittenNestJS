import { NestFactory } from "@nestjs/core";
import { AppModule } from './app.module';
import session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    secret: 'your-secret-key',
    resave: false,

  }));
  await app.listen(3000)
}
bootstrap();