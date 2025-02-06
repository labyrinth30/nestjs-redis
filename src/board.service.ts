import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getBoards(page: number, size: number): Promise<Board[]> {
    const cacheKey = `boards:page:${page}:size:${size}`;
    const cachedData = await this.cacheManager.get<Board[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const skip = (page - 1) * size;
    const boards = await this.boardRepository.find({
      order: {
        createdAt: 'desc',
      },
      skip: skip,
      take: size,
    });

    await this.cacheManager.set(cacheKey, boards);
    console.log(await this.cacheManager.get(cacheKey));

    return boards;
  }
}
