import express from 'express';
import TicketSchema from './ticketSchema';
import Ticket from "./ticketSchema"; // Update the path as per your project structure

const ticketRouter = express.Router();

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
    console.log(error);
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('An error occurred');
    }
  }
});
ticketRouter.get('/tickets/:ticketId', async (req, res) => {
  const { ticketId } = req.params;

  // Convert the ticketId from string to number
  const numericId = parseInt(ticketId, 10);

  // Check if the conversion resulted in a valid number
  if (isNaN(numericId)) {
    return res.status(400).send('Ticket ID must be a valid number');
  }

  try {
    const ticket = await Ticket.findOne({ Id: numericId });

    if (!ticket) {
      return res.status(404).send(`Ticket with ID ${numericId} not found.`);
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    res.status(500).send('An internal server error has occurred');
  }
});
ticketRouter.put('/tickets/:ticketId', async (req, res) => {
  const { ticketId } = req.params;

  // Convert the ticketId from string to number
  const numericId = parseInt(ticketId, 10);

  // Check if the conversion resulted in a valid number
  if (isNaN(numericId)) {
    return res.status(400).send('Ticket ID must be a valid number');
  }

  const updateData = req.body; // The updated data should be in the request body

  try {
    const result = await Ticket.updateOne(
      { Id: numericId }, // Filter
      { $set: updateData }, // Update
      { new: true } // Options
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send(`Ticket with ID ${numericId} not found or data is the same.`);
    }

    res.status(200).json({ message: 'Ticket successfully updated' });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).send('An internal server error has occurred');
  }
});


ticketRouter.delete('/tickets/:ticketId', async (req, res) => {
  const { ticketId } = req.params;

  // Convert the ticketId from string to number
  const numericId = parseInt(ticketId, 10);

  // Check if the conversion resulted in a valid number
  if (isNaN(numericId)) {
    return res.status(400).send('Ticket ID must be a valid number');
  }

  try {
    // Use the numeric ID to delete the corresponding ticket from the collection
    const result = await Ticket.deleteOne({ Id: numericId });

    // If result.deletedCount is 0, no document was found with that ID
    if (result.deletedCount === 0) {
      return res.status(404).send(`Ticket with ID ${numericId} not found.`);
    }

    // If the ticket is deleted successfully, send a success response
    res.status(200).json({ message: 'Ticket successfully deleted' });
  } catch (error) {
    // Handle any other errors
    console.error('Error deleting ticket:', error);
    res.status(500).send('An internal server error has occurred');
  }
  });





export default ticketRouter;
