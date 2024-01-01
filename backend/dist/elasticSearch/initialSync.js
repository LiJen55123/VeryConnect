"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMongoDBWithElasticsearch = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const elasticsearch_1 = require("@elastic/elasticsearch");
function syncMongoDBWithElasticsearch() {
    return __awaiter(this, void 0, void 0, function* () {
        // MongoDB setup
        const mongoUri = 'mongodb://local_dev:local_dev@mongodb:27017/local_dev?authSource=admin';
        yield mongoose_1.default.connect(mongoUri);
        console.log('MongoDB connected');
        const esClient = new elasticsearch_1.Client({ node: 'http://elasticsearch:9200' });
        // Get a list of all collections
        const collections = yield mongoose_1.default.connection.db.listCollections().toArray();
        for (const collection of collections) {
            const collectionName = collection.name;
            let Model = mongoose_1.default.models[collectionName] || mongoose_1.default.model(collectionName, new mongoose_1.default.Schema({}), collectionName);
            // Fetch documents from the collection
            const documents = yield Model.find({}).lean(); // .lean() for better performance
            for (const doc of documents) {
                try {
                    // Index each document in Elasticsearch
                    yield esClient.index({
                        index: `mongo_${collectionName.toLowerCase()}`,
                        id: doc._id.toString(),
                        body: doc
                    });
                }
                catch (err) {
                    console.error(`Error indexing document with id ${doc._id}:`, err);
                    // handle the error appropriately
                }
            }
        }
        console.log('Sync complete.');
        // Optionally close connections if this is a one-time script
        mongoose_1.default.connection.close();
        // esClient.close(); // Uncomment if there's a close method in your Elasticsearch client version
    });
}
exports.syncMongoDBWithElasticsearch = syncMongoDBWithElasticsearch;
