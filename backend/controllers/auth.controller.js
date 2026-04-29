const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');




// POST /api/auth/signup
exports.signup = (req, res) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT, 10);

  bcrypt.hash(req.body.password, saltRounds)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      return user.save();
    })
    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
    .catch(error => res.status(400).json({ error }));
};











// POST /api/auth/login
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,





            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET,
              { expiresIn: '24h' }
            )



            



          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
