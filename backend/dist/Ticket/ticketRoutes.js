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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticketSchema_1 = __importDefault(require("./ticketSchema"));
const ticketSchema_2 = __importDefault(require("./ticketSchema")); // Update the path as per your project structure
const elasticsearch_1 = require("@elastic/elasticsearch");
const ticketRouter = express_1.default.Router();
const esClient = new elasticsearch_1.Client({
    node: 'http://elasticsearch:9200' // Replace with your actual Elasticsearch node address
});
ticketRouter.get('/tickets/form-fields', (req, res) => {
    // Define the structure for the user creation form
    const ticketFormFields = {
        Name: {
            type: 'text',
            required: true,
            placeholder: 'Enter content',
            label: 'Name info'
        },
        // ... include other form fields as needed
    };
    // Send the form structure to the frontend
    res.status(200).json(ticketFormFields); // Corrected line here
});
ticketRouter.post('/tickets/form-fields', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("mission start");
        const newTicket = new ticketSchema_1.default({
            Name: req.body.Name,
        });
        const savedTicket = yield newTicket.save();
        const _a = savedTicket.toObject(), { _id } = _a, ticketData = __rest(_a, ["_id"]); // Exclude _id from the document body
        yield esClient.index({
            index: 'mongo_tickets',
            id: _id.toString(),
            body: ticketData
        });
        console.log("mission success");
        res.status(201).json({ message: 'Ticket created successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}));
ticketRouter.get('/tickets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 20;
    const keyword = req.query.keyword || "";
    try {
        const searchBody = {
            sort: [
                { Id: { order: 'asc' } } // Sort by 'Id' in ascending order
            ]
        };
        // Add search query if keyword is present
        if (keyword.trim() !== "") {
            searchBody.query = {
                multi_match: {
                    query: keyword,
                    fields: ["Name",], // Specify fields to search in, or remove to search in all fields
                    fuzziness: "AUTO", // Use fuzziness if you want to tolerate misspellings
                    prefix_length: 2
                }
            };
        }
        // Replace the Ticket.find({}) with an Elasticsearch search query
        const { body } = yield esClient.search({
            index: 'mongo_tickets', // Your Elasticsearch index name
            from: offset, // Equivalent to "skip" in MongoDB
            size: limit, // Equivalent to "limit" in MongoDB
            body: searchBody
        });
        // The search results are in body.hits.hits
        const tickets = body.hits.hits.map((hit) => hit._source);
        res.status(200).json(tickets);
    }
    catch (error) {
        console.error('Elasticsearch search error:', error);
        res.status(500).send('An error occurred during the search');
    }
}));
ticketRouter.get('/tickets/:ticketId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    // Convert the ticketId from string to number
    const numericId = parseInt(ticketId, 10);
    // Check if the conversion resulted in a valid number
    if (isNaN(numericId)) {
        return res.status(400).send('Ticket ID must be a valid number');
    }
    try {
        const ticket = yield ticketSchema_2.default.findOne({ Id: numericId });
        if (!ticket) {
            return res.status(404).send(`Ticket with ID ${numericId} not found.`);
        }
        res.status(200).json(ticket);
    }
    catch (error) {
        console.error('Error retrieving ticket:', error);
        res.status(500).send('An internal server error has occurred');
    }
}));
ticketRouter.put('/tickets/:ticketId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { ticketId } = req.params;
    // Convert the ticketId from string to number
    const numericId = parseInt(ticketId, 10);
    // Check if the conversion resulted in a valid number
    if (isNaN(numericId)) {
        return res.status(400).send('Ticket ID must be a valid number');
    }
    const updateData = req.body; // The updated data should be in the request body
    try {
        const result = yield ticketSchema_2.default.updateOne({ Id: numericId }, // Filter
        { $set: updateData }, // Update
        { new: true } // Options
        );
        if (result.modifiedCount === 0) {
            return res.status(404).send(`Ticket with ID ${numericId} not found or data is the same.`);
        }
        const searchResponse = yield esClient.search({
            index: 'mongo_tickets',
            body: {
                query: {
                    match: { Id: numericId }
                }
            }
        });
        const esDocId = (_b = searchResponse.body.hits.hits[0]) === null || _b === void 0 ? void 0 : _b._id;
        if (esDocId) {
            // Update the document in Elasticsearch
            yield esClient.update({
                index: 'mongo_tickets',
                id: esDocId,
                body: {
                    doc: updateData
                }
            });
        }
        res.status(200).json({ message: 'Ticket successfully updated' });
    }
    catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).send('An internal server error has occurred');
    }
}));
ticketRouter.delete('/tickets/:ticketId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { ticketId } = req.params;
    // Convert the ticketId from string to number
    const numericId = parseInt(ticketId, 10);
    // Check if the conversion resulted in a valid number
    if (isNaN(numericId)) {
        return res.status(400).send('Ticket ID must be a valid number');
    }
    try {
        // Use the numeric ID to delete the corresponding ticket from the collection
        const result = yield ticketSchema_2.default.deleteOne({ Id: numericId });
        // If result.deletedCount is 0, no document was found with that ID
        if (result.deletedCount === 0) {
            return res.status(404).send(`Ticket with ID ${numericId} not found.`);
        }
        const searchResponse = yield esClient.search({
            index: 'mongo_tickets',
            body: {
                query: {
                    match: { Id: numericId }
                }
            }
        });
        const esDocId = (_c = searchResponse.body.hits.hits[0]) === null || _c === void 0 ? void 0 : _c._id;
        if (esDocId) {
            // Delete the document from Elasticsearch
            yield esClient.delete({
                index: 'mongo_tickets',
                id: esDocId
            });
        }
        // If the ticket is deleted successfully, send a success response
        res.status(200).json({ message: 'Ticket successfully deleted' });
    }
    catch (error) {
        // Handle any other errors
        console.error('Error deleting ticket:', error);
        res.status(500).send('An internal server error has occurred');
    }
}));
exports.default = ticketRouter;
