import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// 🛡️ File filter for PDFs only
function fileFilter(req, file, cb) {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only PDF files are allowed!"), false); // Reject file
  }
}

export const upload = multer({
  storage,
  fileFilter,
});
