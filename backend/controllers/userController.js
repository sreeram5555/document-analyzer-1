

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import userModel from '../models/userModel.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads/profiles';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage }).array('documents');

export const uploadDocuments = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const files = req.files.map((file) => ({
        DocumentName: file.originalname,
        // You would perform your analysis here and populate these fields
        Dates: [],
        entites: [],
        obligations: [],
        risks: [],
        clauses: [],
        questions: [],
      }));

      user.files.push(...files);
      await user.save();

      res.status(200).json({
        message: 'Files uploaded and analysis started.',
        files: user.files,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error during file upload.' });
    }
  });
};


export const getDocumentChatHistory = async (req, res) => {

    try {
        const { documentId } = req.params;
        const user = await userModel.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const document = user.files.id(documentId);
        if (!document) return res.status(404).json({ success: false, message: 'Document not found' });

        res.status(200).json({ success: true, chatHistory: document.chatHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
export const getUpcomingEvents = async (req, res) => {

     ML_AGENT_URL_IS=process.env.ML_AGENT_URL;
    try {
        const userId = req.user._id.toString();
        console.log(userId);
        const eventsUrl = `${ML_AGENT_URL_IS}/events/${userId}`;
        const response = await axios.get(eventsUrl);
        console.log(response)
        res.status(200).json({ success: true, events: response.data });
    } catch (error) {
        console.error('Error fetching upcoming events:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch upcoming events from the analysis service.' 
        });
    }
};