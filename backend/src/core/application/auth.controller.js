import { authService } from '../../features/auth/auth.service.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.register(name, email, password, role);

    res.status(201).json({
      message: 'User created successfully',
      ...result,
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'User already exists') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Login failed' });
  }
};

export const me = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await authService.getUserById(userId);
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to get user info' });
  }
};
