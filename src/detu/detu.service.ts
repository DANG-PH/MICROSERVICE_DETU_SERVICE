import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeTu } from './detu.entity';
import { firstValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import type { SaveGameDeTuRequest, SaveGameDeTuResponse, CreateDeTuRequest,CreateDeTuResponse, GetDeTuRequest, DeTuResponse } from 'proto/detu.pb';

@Injectable()
export class DeTuService {
  constructor(
    @InjectRepository(DeTu)
    private readonly detuRepository: Repository<DeTu>,
  ) {}

  async getDeTuByUser(userId: number): Promise<DeTu | null> {
    return this.detuRepository.findOne({ where: { userId } });
  }

  create(data: Partial<DeTu>): DeTu {
    return this.detuRepository.create(data);
  }

  async saveDeTu(detu: DeTu): Promise<DeTu> {
    return this.detuRepository.save(detu);
  }

  async deleteDeTu(id: number): Promise<void> {
    await this.detuRepository.delete(id);
  }

  async saveGameDeTu(data: SaveGameDeTuRequest): Promise<SaveGameDeTuResponse> {
    let detu = await this.getDeTuByUser(data.userId);

    if (!detu) {
      detu = this.create({
        sucManh: data.sucManh ?? 2000,
        userId: data.userId,
      });
      await this.saveDeTu(detu);
      return { message: 'Tạo đệ tử mới thành công' };
    }

    detu.sucManh = data.sucManh ?? detu.sucManh;
    await this.saveDeTu(detu);
    return { message: 'Cập nhật dữ liệu đệ tử thành công' };
  }

  async createDeTu(data: CreateDeTuRequest): Promise<CreateDeTuResponse> {
    const existed = await this.getDeTuByUser(data.userId);
    if (existed) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'User đã có đệ tử, không thể tạo mới',
      });
    }

    const newDeTu = this.create({
      userId: data.userId,
      sucManh: data.sucManh ?? 2000,
    });
    await this.saveDeTu(newDeTu);

    return { message: 'Tạo đệ tử mới thành công' };
  }

  async getDeTuByUserGrpc(data: GetDeTuRequest): Promise<DeTuResponse> {
    return {
      detu: await this.getDeTuByUser(data.userId) || undefined,
    };
  }
}