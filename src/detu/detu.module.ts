import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeTuService } from './detu.service';
import { DeTuController } from './detu.controller';
import { DeTu } from './detu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeTu])], // Đăng ký repository cho Item
  providers: [DeTuService],
  controllers: [DeTuController],
  exports: [DeTuService], // nếu muốn dùng ở module khác
})
export class DeTuModule {}