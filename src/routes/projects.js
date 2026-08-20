const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware); // bu satırdan sonrakiler giriş gerektirir

router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany({ where: { ownerId: req.userId } });
  res.json(projects);
});

router.post('/', async (req, res) => {
  const { title } = req.body;
  const project = await prisma.project.create({ data: { title, ownerId: req.userId } });
  res.json(project);
});

router.delete('/:id', async (req, res) => {
  await prisma.project.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Silindi' });
});

module.exports = router;