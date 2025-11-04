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
      url: '0.0.0.0:50054', 
      loader: {
        keepCase: true,
        objects: true,
        arrays: true,
      },
    },
  });

  await app.startAllMicroservices();
  logger.log('✅ gRPC server running on localhost:50054');

  await app.listen(process.env.PORT ?? 3002);
  logger.log(`✅ HTTP server running on ${process.env.PORT ?? 3002}`);
}

bootstrap();
