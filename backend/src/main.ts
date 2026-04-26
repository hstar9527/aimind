import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用CORS
  const allowedOrigins = [
    'http://localhost:3000',
    'https://tools.pxcharts.com',
    'http://tools.pxcharts.com'
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // 允许没有origin的请求（比如移动端、Postman等）
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  
  // 设置全局前缀
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 服务已启动: http://localhost:${port}`);
}
bootstrap();
