import mongoose from 'mongoose';

// Counter Schema
const CounterSchema = new mongoose.Schema({
  _id: String,
  seq: Number
});

const Counter = mongoose.model('Counter', CounterSchema);

// Ticket Schema
const TicketSchema = new mongoose.Schema({
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
TicketSchema.pre('save', function(next) {
  const doc = this;

  Counter.findByIdAndUpdate(
    { _id: 'ticketId' },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
      useFindAndModify: false // This option is for older versions of Mongoose
    }
  ).then((counter) => {
    if (counter) {
      doc.Id = counter.seq;
      next();
    } else {
      next(new Error('Counter not found'));
    }
  }).catch(next);
});

const Ticket = mongoose.model('Ticket', TicketSchema);

export default Ticket;
