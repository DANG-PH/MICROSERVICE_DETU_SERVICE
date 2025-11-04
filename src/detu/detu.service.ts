import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeTu } from './detu.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeTuService {
  constructor(
    @InjectRepository(DeTu)
    private readonly detuRepository: Repository<DeTu>,
  ) {}

  async getDeTuByUser(userId: number): Promise<DeTu | null> {
    const detu = await this.detuRepository.findOne({
        where: { userId: userId },
    });

    return detu;
  }

  async getDeTu(id: number): Promise<DeTu | null> {
    return this.detuRepository.findOne({ where: { id } });
  }

  async saveDeTu(DeTu: DeTu): Promise<DeTu> {
    return this.detuRepository.save(DeTu);
  }

  async deleteDeTu(id: number): Promise<void> {
    await this.detuRepository.delete(id);
  }

  // Tạo entity từ object thuần
  create(data: Partial<DeTu>): DeTu {
    return this.detuRepository.create(data);
  }
}
