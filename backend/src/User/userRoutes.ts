import express from 'express';
import User from './Schema'; // Update the path as per your project structure

const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send('User created successfully');
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).send(error.message);
  } else {
    // If it's not an Error instance, you might want to send a generic response
    res.status(500).send('An error occurred');
  }
}
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('An error occurred');
    }
  }
});


router.get('/users/form-fields', (req, res) => {
  // Define the structure for the user creation form
  const userFormFields = {
    username: {
      type: 'text',
      required: true,
      placeholder: 'Enter username',
      label: 'Username'
    },
    password: {
      type: 'password',
      required: true,
      placeholder: 'Enter password',
      label: 'Password'
    },
    email: {
      type: 'email',
      required: true,
      placeholder: 'Enter email',
      label: 'Email'
    },
  };

  // Send the form structure to the frontend
  res.status(200).json(userFormFields);
});


export default router;
