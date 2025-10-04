import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/userModel.js';

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(path.resolve(), 'uploads', 'profiles');
//     fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `profile_${req.user._id}${ext}`);
//   },
// });      to: email,
//       subject: "Password Reset Successful",
//       html: `<p>Your password has been successfully reset.</p>`,
   
// const upload = multer({ storage: fileStorage });

// export const uploadProfileImage = upload.single('profileImage');


const fileStorage = multer.diskStorage({
 destination: (req, file, cb) => {
 cb(null, '/public/uploads/profiles'); 
 
},
    filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null,`${Date.now()}_${Math,random()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);  // accept file
  } else {
    cb(new Error("Invalid file type. Only PDF, DOCX, and TXT are allowed."), false);
  }
};
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });
