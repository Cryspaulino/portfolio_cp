import bcrypt from 'bcrypt';
import db from '../db.js';

/**
 * Find a user by email address for login verification.
 * 
 * @param {string} email - Email address to search for
 * @returns {Promise<Object|null>} User object with password hash or null if not found
 */
export const findUserByEmail = async (email) => {
    const query = `
        SELECT 
            users.id, 
            users.name, 
            users.email, 
            users.password, 
            users.created_at,
        LIMIT 1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
};

/**
 * Verify a plain text password against a stored bcrypt hash.
 * 
 * @param {string} plainPassword - The password to verify
 * @param {string} hashedPassword - The stored password hash
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
export const verifyPassword = async (plainPassword, hashedPassword) => {
    const result = await bcrypt.compare(plainPassword, hashedPassword);

    return result;
};