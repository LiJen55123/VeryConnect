"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const ticketRoutes_1 = __importDefault(require("./Ticket/ticketRoutes"));
const initialSync_1 = require("./elasticSearch/initialSync"); // Assuming
const app = (0, express_1.default)();
const port = 8000;
// Replace with your MongoDB connection string
const mongoUri = 'mongodb://local_dev:local_dev@mongodb:27017/local_dev?authSource=admin';
mongoose_1.default.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(ticketRoutes_1.default); // Using the user routes
(0, initialSync_1.syncMongoDBWithElasticsearch)().then(() => console.log('Sync complete.'))
    .catch((err) => console.error('An error occurred:', err));
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
