import { Module } from '@nestjs/common';
import { VectorStoreController } from './vector-store.controller';
import { VectorStoreService } from './vector-store.service';

@Module({
  controllers: [VectorStoreController],
  providers: [VectorStoreService]
})
export class VectorStoreModule {}
