const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');

// Kayıt ol
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('İsim boş olamaz'),
    body('email').isEmail().withMessage('Geçerli bir email giriniz'),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword }
      });
      res.json({ message: 'Kayıt başarılı', userId: user.id });
    } catch (err) {
      res.status(400).json({ error: 'Kayıt başarısız: ' + err.message });
    }
  }
);

// Giriş yap
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Geçerli bir email giriniz'),
    body('password').notEmpty().withMessage('Şifre boş olamaz')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: 'Kullanıcı bulunamadı' });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(400).json({ error: 'Şifre yanlış' });

      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);
// Sadece admin: tüm kullanıcıları listeleme
router.get('/users', authMiddleware, checkAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;