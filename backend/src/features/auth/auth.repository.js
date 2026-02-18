import { pool as db } from '../../infrastructure/database/db.js';

export const authRepository = {
    findUserByEmail: async (email) => {
        const [users] = await db.execute(
            'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
            [email]
        );
        return users[0] || null;
    },

    findUserById: async (id) => {
        const [users] = await db.execute(
            'SELECT id, name, email, role FROM users WHERE id = ?',
            [id]
        );
        return users[0] || null;
    },

    createUser: async (user) => {
        const { name, email, passwordHash, role } = user;
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, passwordHash, role]
        );
        return result.insertId;
    },
};
