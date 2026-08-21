function checkAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Bu işlem için admin yetkisi gerekiyor' });
  }
  next();
}

module.exports = checkAdmin;