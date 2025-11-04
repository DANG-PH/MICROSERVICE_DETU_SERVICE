import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { DeTuService } from './detu.service';
import type { SaveGameDeTuRequest, SaveGameDeTuResponse, CreateDeTuRequest,CreateDeTuResponse, GetDeTuRequest, DeTuResponse } from 'proto/detu.pb';
import { DE_TU_SERVICE_NAME } from 'proto/detu.pb';

@Controller()
export class DeTuController {
  constructor(
    private readonly deTuService: DeTuService,
  ) {}

  @GrpcMethod(DE_TU_SERVICE_NAME, 'SaveGameDeTu')
  async saveGameDeTu(data: SaveGameDeTuRequest): Promise<SaveGameDeTuResponse> {
    const found = await this.deTuService.getDeTuByUser(data.userId);
    if (!found) {
        const newDeTu = this.deTuService.create({
            sucManh: data.sucManh ?? 2000,
            userId: data.userId,
        });

        await this.deTuService.saveDeTu(newDeTu);
        return {
            message: 'Tạo đệ tử mới thành công'
        }
    } 
    found.sucManh = data.sucManh ?? found.sucManh;
    await this.deTuService.saveDeTu(found);
    return {
        message: 'Cập nhật dữ liệu đệ tử thành công'
    };
  }

  @GrpcMethod(DE_TU_SERVICE_NAME, 'CreateDeTu')
  async createDeTu(data: CreateDeTuRequest) : Promise<CreateDeTuResponse> {
    const existed = await this.deTuService.getDeTuByUser(data.userId);
    if (existed) {
      throw new RpcException({code: status.ALREADY_EXISTS ,message: 'User đã có đệ tử, không thể tạo mới'});
    }

    const newDeTu = this.deTuService.create({
      userId: data.userId,
      sucManh: data.sucManh ?? 2000,
    });

    await this.deTuService.saveDeTu(newDeTu);
    return {
        message: "Tạo đệ tử mới thành công"
    };
  }

  @GrpcMethod(DE_TU_SERVICE_NAME, 'GetDeTuByUserId')
  async getDeTu(data: GetDeTuRequest) : Promise<DeTuResponse> {
    return {
        detu: await this.deTuService.getDeTuByUser(data.userId) || undefined
    }
  }
}