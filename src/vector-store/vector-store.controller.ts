import { Controller } from '@nestjs/common';
import { VectorStoreService } from './vector-store.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('vector-store')
export class VectorStoreController {
    constructor(private readonly chatService: VectorStoreService) { }
    @GrpcMethod('VectorStoreService', 'StoreDocuments')
    async storeDocuments(data: { documents: { id: string; document: string; metadata: any }[] }) {
        return await this.chatService.storeDocuments(data.documents);
    }
    @GrpcMethod("VectorStoreService", "DeleteDocument")
    async deleteDocument(data: { id: string }) {
        return await this.chatService.deleteDocument(data.id);
    }
    @GrpcMethod("VectorStoreService", "FindSimilarDocuments")
    async findSimilarDocuments(data: { query: string }) {
        return await this.chatService.findSimilarDocuments(data.query);
    }

}
