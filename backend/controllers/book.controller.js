const Book = require('../models/Book');

// GET /api/books
exports.getAllBooks = (req, res) => {
  Book.find()
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
  const book = new Book({
    ...req.body
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre créé !' }))
    .catch(error => res.status(400).json({ error }));
};

// PUT /api/books/:id
exports.updateBook = (req, res) => {
  Book.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

// DELETE /api/books/:id
exports.deleteBook = (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};

// POST /api/books/:id/rating
exports.rateBook = (req, res) => {
  const { userId, grade } = req.body;

  Book.findOne({ _id: req.params.id })
    .then(book => {
      book.ratings.push({ userId, grade });

      // recalcul de la moyenne
      const total = book.ratings.reduce((acc, r) => acc + r.grade, 0);
      book.averageRating = total / book.ratings.length;

      return book.save();
    })
    .then(updatedBook => res.status(200).json(updatedBook))
    .catch(error => res.status(400).json({ error }));
};
