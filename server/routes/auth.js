const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// In-memory user storage (replace with database in production)
const users = new Map();

// Demo user for testing
users.set('demo@attributeai.com', {
  id: 'demo-user-id',
  email: 'demo@attributeai.com',
  password: '$2a$10$BjFGKv3Czq4Qe8d4WyCxPOYER6voficsB1YNmoT4YPXyK9cNpCu8C', // 'demo123' hashed
  firstName: 'Demo',
  lastName: 'User',
  company: 'AttributeAI Demo',
  websiteUrl: 'https://example.com',
  industry: 'Technology',
  monthlyTraffic: '10K-50K/month',
  primaryGoals: ['Increase Organic Traffic', 'Better Attribution'],
  currentTools: ['Google Analytics', 'Google Ads'],
  analytics: {
    googleAnalyticsId: 'G-DEMO123456',
    searchConsoleUrl: 'https://example.com',
    metaBusinessId: '123456789',
    facebookPixelId: '987654321'
  },
  createdAt: new Date().toISOString(),
  lastLogin: null
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const {
      firstName, lastName, email, password, company, websiteUrl,
      googleAnalyticsId, googleSearchConsoleUrl, metaBusinessId, facebookPixelId,
      industry, monthlyTraffic, primaryGoals, currentTools
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    if (users.has(email.toLowerCase())) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userId = uuidv4();
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName, lastName, company: company || '', websiteUrl: websiteUrl || '',
      industry: industry || '', monthlyTraffic: monthlyTraffic || '',
      primaryGoals: primaryGoals || [], currentTools: currentTools || [],
      analytics: {
        googleAnalyticsId: googleAnalyticsId || '',
        searchConsoleUrl: googleSearchConsoleUrl || '',
        metaBusinessId: metaBusinessId || '',
        facebookPixelId: facebookPixelId || ''
      },
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    users.set(email.toLowerCase(), newUser);

    const token = jwt.sign({ userId: userId, email: email.toLowerCase() }, JWT_SECRET, { expiresIn: '24h' });

    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date().toISOString();

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify session endpoint
router.get('/verify-session', authenticateToken, (req, res) => {
  try {
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Website verification endpoint
router.post('/verify-website', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    try {
      const response = await fetch(url, { method: 'HEAD', timeout: 10000 });
      
      res.json({
        accessible: response.ok,
        status: response.status,
        message: response.ok ? 'Website is accessible' : 'Website may have issues'
      });
    } catch (error) {
      res.json({
        accessible: false,
        status: 0,
        message: 'Website is not accessible or does not exist'
      });
    }

  } catch (error) {
    console.error('Website verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;