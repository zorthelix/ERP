import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

function createToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      name: user.full_name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    }
  );
}

export async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body;

    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existing.rowCount) {
      return res
        .status(409)
        .json({ error: 'An account already exists for this email address.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [
        fullName.trim(),
        email.toLowerCase(),
        passwordHash
      ]
    );

    const user = result.rows[0];

    return res.status(201).json({
      message: 'Account created successfully.',
      token: createToken(user),
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, created_at
       FROM users
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    const user = result.rows[0];

    if (
      !user ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res
        .status(401)
        .json({ error: 'Email or password is incorrect.' });
    }

    return res.json({
      message: 'Signed in successfully.',
      token: createToken(user),
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    return next(error);
  }
}