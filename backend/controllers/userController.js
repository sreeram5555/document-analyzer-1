

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
    try {
        // ✅ Correct way to get environment variable
        const ML_AGENT_URL = process.env.ML_AGENT_URL;
        
        console.log("ML_AGENT_URL:", ML_AGENT_URL);
        
        // Check if environment variable exists
        if (!ML_AGENT_URL) {
            console.error("ML_AGENT_URL environment variable is not set");
            return res.status(500).json({
                success: false,
                message: "ML service configuration error"
            });
        }

        const userId = req.user._id.toString();
        console.log("Fetching events for user ID:", userId);
        
        const eventsUrl = `${ML_AGENT_URL}/events/${userId}`;
        console.log("Calling ML service URL:", eventsUrl);

        const response = await axios.get(eventsUrl, {
            timeout: 10000 // 10 second timeout
        });
        
        console.log("ML service response received:", response.data);
        
        res.status(200).json({ 
            success: true, 
            events: response.data 
        });
        
    } catch (error) {
        console.error('Error fetching upcoming events:');
        
        if (error.code === 'ENOTFOUND') {
            console.error('Network error - cannot reach ML service');
            return res.status(503).json({
                success: false,
                message: 'ML analysis service is currently unavailable'
            });
        }
        
        if (error.response) {
            // ML service returned an error
            console.error('ML service error:', error.response.status, error.response.data);
            return res.status(502).json({
                success: false,
                message: 'ML service returned an error'
            });
        }
        
        if (error.request) {
            // Request was made but no response received
            console.error('No response from ML service:', error.request);
            return res.status(504).json({
                success: false,
                message: 'ML service timeout - no response received'
            });
        }
        
        // Other errors
        console.error('Unexpected error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch upcoming events' 
        });
    }
};

// export const getUpcomingEvents = async (req, res) => {
//     try {
//         const ML_AGENT_URL = process.env.ML_AGENT_URL;
        
//         // If ML service URL is not set, return sample events
//         if (!ML_AGENT_URL) {
//             console.warn("ML_AGENT_URL not set, returning sample events");
//             const sampleEvents = [
//                 {
//                     title: "Document Review Reminder",
//                     date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
//                     type: "review",
//                     document: "Sample Document"
//                 }
//             ];
//             return res.status(200).json({ 
//                 success: true, 
//                 events: sampleEvents 
//             });
//         }

//         const userId = req.user._id.toString();
//         const eventsUrl = `${ML_AGENT_URL}/events/${userId}`;
        
//         const response = await axios.get(eventsUrl, { timeout: 10000 });
        
//         res.status(200).json({ 
//             success: true, 
//             events: response.data 
//         });
        
//     } catch (error) {
//         console.error('Error fetching events from ML service:', error.message);
        
//         // Return empty events array as fallback
//         res.status(200).json({ 
//             success: true, 
//             events: [] 
//         });
//     }
// };

s