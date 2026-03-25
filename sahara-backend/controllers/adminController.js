const User = require('../models/user.models');
const bcrypt = require('bcryptjs');

// @desc    Create a new Doctor
// @access  Private (Admin only)
const createDoctor = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'doctor',
        });

        await user.save();
        res.status(201).json({ message: 'Doctor created successfully' });
    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new Lab Technician
// @access  Private (Admin only)
const createLab = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'lab',
        });

        await user.save();
        res.status(201).json({ message: 'Lab Technician created successfully' });
    } catch (error) {
        console.error('Error creating lab technician:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createDoctor,
    createLab,
    getAllUsers,
};
