import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { DETU_PACKAGE_NAME } from 'proto/detu.pb';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: DETU_PACKAGE_NAME,
      protoPath: join(process.cwd(), 'proto/detu.proto'), 
      url: process.env.DETU_URL, 
      loader: {
        keepCase: true,
        objects: true,
        arrays: true,
      },
    },
  });

  await app.startAllMicroservices();
  logger.log(`✅ gRPC server running on ${process.env.DETU_URL}`);

  await app.listen(Number(process.env.PORT));
  logger.log(`✅ HTTP server running on ${process.env.PORT}`);
}

bootstrap();
