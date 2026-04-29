const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `${Date.now()}-${req.file.originalname.split(' ').join('_')}.webp`;
  const outputPath = path.join('images', filename);

  try {




    await sharp(req.file.buffer)
      .resize(500)
      .webp({ quality: 80 })
      .toFile(outputPath);





      
    req.file.filename = filename;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'optimisation de l'image" });
  }
};

