import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '../db/database';
import { generateToken, requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

const RegisterSchema = z.object({
  username: z.string().trim().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(30),
  email: z.string().trim().email('Correo electrónico no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  avatar: z.string().url().optional(),
});

const LoginSchema = z.object({
  email: z.string().trim().email('Correo electrónico no válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// POST /api/auth/register
router.post('/register', authLimiter, (req, res: Response) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { username, email, password, avatar } = parsed.data;

    // Check if user or email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existing) {
      return res.status(409).json({ error: 'El correo electrónico o nombre de usuario ya está registrado.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const defaultAvatar = avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    const insert = db.prepare(`
      INSERT INTO users (username, email, password_hash, avatar)
      VALUES (?, ?, ?, ?)
    `);

    const result = insert.run(username, email, passwordHash, defaultAvatar);
    const userId = Number(result.lastInsertRowid);

    const token = generateToken({ id: userId, username, email });

    return res.status(201).json({
      message: 'Usuario registrado con éxito en MealCarta',
      token,
      user: {
        id: userId,
        username,
        email,
        avatar: defaultAvatar,
      },
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Error en el servidor al registrar el usuario' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, (req, res: Response) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { email, password } = parsed.data;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas. Compruebe el correo y la contraseña.' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas. Compruebe el correo y la contraseña.' });
    }

    const token = generateToken({ id: user.id, username: user.username, email: user.email });

    return res.json({
      message: 'Sesión iniciada correctamente',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Error en el servidor al iniciar sesión' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT id, username, email, avatar, created_at FROM users WHERE id = ?').get(req.user!.id) as any;
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Get count of favorites
    const favCount = (db.prepare('SELECT count(*) as count FROM favorites WHERE user_id = ?').get(user.id) as any).count;
    
    // Get count of reviews
    const reviewCount = (db.prepare('SELECT count(*) as count FROM reviews WHERE user_id = ?').get(user.id) as any).count;

    return res.json({
      user: {
        ...user,
        favorites_count: favCount,
        reviews_count: reviewCount,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Error al consultar el perfil' });
  }
});

export default router;
