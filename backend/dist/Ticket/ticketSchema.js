"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Counter Schema
const CounterSchema = new mongoose_1.default.Schema({
    _id: String,
    seq: Number
});
const Counter = mongoose_1.default.model('Counter', CounterSchema);
// Ticket Schema
const TicketSchema = new mongoose_1.default.Schema({
    Id: {
        type: Number,
    },
    Name: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Auto-increment for Ticket Id
TicketSchema.pre('save', function (next) {
    const doc = this;
    Counter.findByIdAndUpdate({ _id: 'ticketId' }, { $inc: { seq: 1 } }, {
        new: true,
        upsert: true,
        useFindAndModify: false // This option is for older versions of Mongoose
    }).then((counter) => {
        if (counter) {
            doc.Id = counter.seq;
            next();
        }
        else {
            next(new Error('Counter not found'));
        }
    }).catch(next);
});
const Ticket = mongoose_1.default.model('Ticket', TicketSchema);
exports.default = Ticket;
