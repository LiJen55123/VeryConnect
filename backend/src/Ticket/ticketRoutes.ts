import express from 'express';
import TicketSchema from './ticketSchema';
import Ticket from "./ticketSchema"; // Update the path as per your project structure

const ticketRouter = express.Router();

ticketRouter.post('/tickets', async (req, res) => {
  try {
    const newUser = new TicketSchema(req.body);
    await newUser.save();
    res.status(201).send('Ticket created successfully');
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).send(error.message);
  } else {
    // If it's not an Error instance, you might want to send a generic response
    res.status(500).send('An error occurred');
  }
}
});

ticketRouter.get('/tickets', async (req, res) => {
  try {
    const users = await Ticket.find({});
    res.status(200).json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('An error occurred');
    }
  }
});


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


export default ticketRouter;
