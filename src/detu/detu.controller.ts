import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { DeTuService } from './detu.service';
import type { SaveGameDeTuRequest, SaveGameDeTuResponse, CreateDeTuRequest,CreateDeTuResponse, GetDeTuRequest, DeTuResponse } from 'proto/detu.pb';
import { DE_TU_SERVICE_NAME } from 'proto/detu.pb';

@Controller()
export class DeTuController {
  constructor(private readonly deTuService: DeTuService) {}

  @GrpcMethod(DE_TU_SERVICE_NAME, 'SaveGameDeTu')
  async saveGameDeTu(data: SaveGameDeTuRequest): Promise<SaveGameDeTuResponse> {
    return this.deTuService.saveGameDeTu(data);
  }

  @GrpcMethod(DE_TU_SERVICE_NAME, 'CreateDeTu')
  async createDeTu(data: CreateDeTuRequest): Promise<CreateDeTuResponse> {
    return this.deTuService.createDeTu(data);
  }

  @GrpcMethod(DE_TU_SERVICE_NAME, 'GetDeTuByUserId')
  async getDeTu(data: GetDeTuRequest): Promise<DeTuResponse> {
    return this.deTuService.getDeTuByUserGrpc(data);
  }
}