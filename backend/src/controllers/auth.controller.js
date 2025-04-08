const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

class AuthController {
  async login(req, res) { 
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  }

  async register(req, res) {
    const { email, password, role = 'INSPECTOR' } = req.body;
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can register users' });
    }
    if (!['ADMIN', 'TEACHER', 'INSPECTOR'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });
      res.status(201).json({ id: user.id, email: user.email, role: user.role });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async me(req, res) {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { teacher: true },
    });
    res.json(user);
  }
}

module.exports = new AuthController();