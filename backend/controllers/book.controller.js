const Book = require('../models/Book');
const fs = require('fs');

// GET /api/books
exports.getAllBooks = (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// GET /api/books/bestrating
exports.getBestRatedBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// GET /api/books/:id
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

// POST /api/books
exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre créé !' }))
    .catch(error => res.status(400).json({ error }));
};

// PUT /api/books/:id
exports.updateBook = (req, res) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    : { ...req.body };

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Requête non autorisée !' });
      }

      if (req.file) {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {});
      }

      return Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      );
    })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

// DELETE /api/books/:id
exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Requête non autorisée !' });
      }

      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// POST /api/books/:id/rating
exports.rateBook = (req, res) => {
  const { userId, rating } = req.body;
  const grade = parseInt(rating, 10);

  Book.findOne({ _id: req.params.id })
    .then(book => {
      const alreadyRated = book.ratings.find(r => r.userId === userId);
      if (alreadyRated) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
      }

      book.ratings.push({ userId, grade });

      const total = book.ratings.reduce((acc, r) => acc + r.grade, 0);
      book.averageRating = total / book.ratings.length;

      return book.save();
    })
    .then(updatedBook => res.status(200).json(updatedBook))
    .catch(error => res.status(400).json({ error }));
};
