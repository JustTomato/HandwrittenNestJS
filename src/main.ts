import { NestFactory } from "@nestjs/core";
import { AppModule } from './app.module';
import session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }

  }));
  await app.listen(3000)
}
bootstrap();