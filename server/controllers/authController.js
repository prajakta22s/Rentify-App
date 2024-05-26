const User = require('../models/User');
const bcrypt = require('bcrypt');  // Add this line to import bcrypt

const registerUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, userType, password } = req.body;
  try {
    const user = new User({ firstName, lastName, email, phoneNumber, userType, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    res.status(200).send({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
