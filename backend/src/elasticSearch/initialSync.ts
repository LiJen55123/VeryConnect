import mongoose from 'mongoose';
import { Client } from '@elastic/elasticsearch';

export async function syncMongoDBWithElasticsearch(): Promise<void> {
    // MongoDB setup
    const mongoUri: string = 'mongodb://local_dev:local_dev@mongodb:27017/local_dev?authSource=admin';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    const esClient: Client = new Client({ node: 'http://elasticsearch:9200' });

    // Get a list of all collections
    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const collection of collections) {
        const collectionName = collection.name;
        let Model = mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}), collectionName);

        // Fetch documents from the collection
        const documents = await Model.find({}).lean(); // .lean() for better performance

        for (const doc of documents as any) {
            try {
                // Index each document in Elasticsearch
                await esClient.index({
                    index: `mongo_${collectionName.toLowerCase()}`,
                    id: doc._id.toString(),
                    body: doc
                });
            } catch (err) {
                console.error(`Error indexing document with id ${doc._id}:`, err);
                // handle the error appropriately
            }
        }
    }

    console.log('Sync complete.');
    // Optionally close connections if this is a one-time script
    mongoose.connection.close();
    // esClient.close(); // Uncomment if there's a close method in your Elasticsearch client version
}

if (require.main === module) {
    syncMongoDBWithElasticsearch()
        .catch((err: Error) => console.error('An error occurred:', err));
}
