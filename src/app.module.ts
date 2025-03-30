import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VectorStoreModule } from './vector-store/vector-store.module';

@Module({
  imports: [VectorStoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
