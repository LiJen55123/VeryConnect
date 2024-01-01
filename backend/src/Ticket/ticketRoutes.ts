import express from 'express';
import TicketSchema from './ticketSchema';
import Ticket from "./ticketSchema"; // Update the path as per your project structure

const ticketRouter = express.Router();

ticketRouter.post('/tickets/form-fields', async (req, res) => {
  try {
    const newUser = new TicketSchema({ // <-- Change this to use the model
      Name: req.body.Name,});
    await newUser.save();
    res.status(201).json({ message: 'Ticket created successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

ticketRouter.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).json(tickets);
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
    // ... include other form fields as needed
  };

  // Send the form structure to the frontend
  res.status(200).json(ticketFormFields); // Corrected line here
});


export default ticketRouter;
