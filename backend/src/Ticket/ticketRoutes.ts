import express from 'express';
import TicketSchema from './ticketSchema';
import Ticket from "./ticketSchema"; // Update the path as per your project structure
import { Client } from '@elastic/elasticsearch';

const ticketRouter = express.Router();
const esClient = new Client({
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
ticketRouter.post('/tickets/form-fields', async (req, res) => {
  try {
    const newTicket = new TicketSchema({ // <-- Change this to use the model
      Name: req.body.Name,});
    const savedTicket = await newTicket.save();
    const { _id, ...ticketData } = savedTicket.toObject(); // Exclude _id from the document body
    await esClient.index({
      index: 'mongo_tickets',
      id: _id.toString(),
      body: ticketData
    });
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
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const keyword = req.query.keyword as string || "";
  interface ITicket {
  Id: number;
  Name: string;
  createdAt: Date;
  }


  try {
    const searchBody: any = {
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
    const { body } = await esClient.search({
      index: 'mongo_tickets', // Your Elasticsearch index name
      from: offset, // Equivalent to "skip" in MongoDB
      size: limit, // Equivalent to "limit" in MongoDB
      body: searchBody
    });

    // The search results are in body.hits.hits
    const tickets: ITicket[] = body.hits.hits.map((hit: { _source: ITicket }) => hit._source);
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Elasticsearch search error:', error);
    res.status(500).send('An error occurred during the search');
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
    const searchResponse = await esClient.search({
      index: 'mongo_tickets',
      body: {
        query: {
          match: { Id: numericId }
        }
      }
    });
    const esDocId = searchResponse.body.hits.hits[0]?._id;
    if (esDocId) {
      // Update the document in Elasticsearch
      await esClient.update({
        index: 'mongo_tickets',
        id: esDocId,
        body: {
          doc: updateData
        }
      });
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
    const searchResponse = await esClient.search({
      index: 'mongo_tickets',
      body: {
        query: {
          match: { Id: numericId }
        }
      }
    });

    const esDocId = searchResponse.body.hits.hits[0]?._id;
    if (esDocId) {
      // Delete the document from Elasticsearch
      await esClient.delete({
        index: 'mongo_tickets',
        id: esDocId
      });
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
