import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';

export const authService = {
    register: async (name, email, password, role = 'client') => {
        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const userId = await authRepository.createUser({
            name,
            email,
            passwordHash,
            role,
        });

        const token = jwt.sign(
            { id: userId, email, role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: { id: userId, name, email, role },
        };
    },

    login: async (email, password) => {
        const user = await authRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    },

    getUserById: async (userId) => {
        const user = await authRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
};
