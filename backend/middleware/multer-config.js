const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

// Storage en mémoire
const storage = multer.memoryStorage();

// Filtre MIME
const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) {
    // Type autorisé
    callback(null, true);
  } else {
    // Type refusé
    callback(new Error("Type de fichier non autorisé. Formats acceptés : jpg, jpeg, png, webp"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter
}).single('image');


