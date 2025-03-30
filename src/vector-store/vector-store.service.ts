import { OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import weaviate, { ApiKey, WeaviateClient } from 'weaviate-ts-client';
require('dotenv').config();
@Injectable()
export class VectorStoreService {
    private client: WeaviateClient;
    private embeddings:OpenAIEmbeddings;

  constructor() {
    const apiKey = new ApiKey(process.env.WEAVIATE_API_KEY!);
    this.client = weaviate.client({
        scheme: 'https',
        host: process.env.WEAVIATE_HOST!,
        apiKey:apiKey
    });
    this.embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
  }
  async createSchema() {
    const schema = {
      class: 'Document',
      vectorizer: 'none', 
      properties: [
        { name: 'id_docs', dataType: ['string'], indexInverted: true },
        { name: 'text', dataType: ['text'], indexInverted: true },
        { name: 'metadata', dataType: ['string'], indexInverted: true },
      ],
    };
  
    try {
      await this.client.schema.classCreator().withClass(schema).do();
      return { message: 'Schema created successfully' };
    } catch (error) {
      console.error('Error creating schema:', error);
      return { message: 'Schema creation failed', error };
    }
  }
  
  async storeDocuments(docs: { id: string; document: string; metadata: any }[]) {
    await this.createSchema();
    for (const doc of docs) {
      const embedding = await this.embeddings.embedQuery(doc.document);
      await this.client.data.creator()
        .withClassName('Document')
        .withProperties({ id_docs: doc.id, text: doc.document, metadata: doc.metadata, vector: embedding })
        .do();
    }
    return { message: 'Documents stored successfully' };
  }

  async deleteDocument(id: string) {
    await this.client.data.deleter()
      .withClassName('Document')
      .withId(id)
      .do();
    return { message: 'Document deleted successfully' };
  }

  async findSimilarDocuments(query: string) {
    const embedding = await this.embeddings.embedQuery(query);
    const result = await this.client.graphql.get()
      .withClassName('Document')
      .withFields('id_docs text metadata')
      .withNearVector({ vector: embedding, certainty: 0.7 })
      .withLimit(3)
      .do();
    console.log(result.data.Get.Document);
    return result.data.Get.Document;
  }
  
}
