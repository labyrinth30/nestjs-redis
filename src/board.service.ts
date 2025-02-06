import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Board } from './board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async getBoards(page: number, size: number): Promise<Board[]> {
    const skip = (page - 1) * size;
    const boards = await this.boardRepository.find({
      order: { createdAt: 'DESC' },
      skip: skip,
      take: size,
    });
    return boards;
  }
}
