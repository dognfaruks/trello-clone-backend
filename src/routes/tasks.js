const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { projectId: Number(req.query.projectId) }
  });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title, projectId } = req.body;
  const task = await prisma.task.create({ data: { title, projectId: Number(projectId) } });
  res.json(task);
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body; // "todo" | "doing" | "done"
  const task = await prisma.task.update({
    where: { id: Number(req.params.id) },
    data: { status }
  });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await prisma.task.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Silindi' });
});

module.exports = router;