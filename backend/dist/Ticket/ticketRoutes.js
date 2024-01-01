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
const express_1 = __importDefault(require("express"));
const ticketSchema_1 = __importDefault(require("./ticketSchema"));
const ticketSchema_2 = __importDefault(require("./ticketSchema")); // Update the path as per your project structure
const ticketRouter = express_1.default.Router();
ticketRouter.post('/tickets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new ticketSchema_1.default(req.body);
        yield newUser.save();
        res.status(201).send('Ticket created successfully');
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
        else {
            // If it's not an Error instance, you might want to send a generic response
            res.status(500).send('An error occurred');
        }
    }
}));
ticketRouter.get('/tickets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield ticketSchema_2.default.find({});
        res.status(200).json(users);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
        else {
            res.status(500).send('An error occurred');
        }
    }
}));
ticketRouter.get('/tickets/form-fields', (req, res) => {
    // Define the structure for the user creation form
    const ticketFormFields = {
        name: {
            type: 'text',
            required: true,
            placeholder: 'Enter content',
            label: 'Name info'
        },
    };
    // Send the form structure to the frontend
    res.status(200).json(ticketRouter);
});
exports.default = ticketRouter;
