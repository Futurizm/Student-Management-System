const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

class UserController {
  async createUser(req, res) {
    const { email, password, role = 'INSPECTOR' } = req.body;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can create users' });
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

  async getUsers(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can view users' });
    }
    const users = await prisma.user.findMany();
    res.json(users);
  }
}

module.exports = new UserController();