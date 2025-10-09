import userModel from '../models/userModel.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const ML_AGENT_URL = process.env.ML_AGENT_URL;

export const uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    
    const ML_UPLOAD_ENDPOINT = `${ML_AGENT_URL}/upload-document/`;

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);
        formData.append('user_id', req.user._id.toString());

        const mlApiResponse = await axios.post(ML_UPLOAD_ENDPOINT, formData, { 
            headers: { ...formData.getHeaders() } 
        });
        
        const analysisResult = mlApiResponse.data;
        const user = await userModel.findById(req.user._id);

        const newDocument = {
            DocumentName: analysisResult.file_name,
            filePath: req.file.path, // **THIS IS THE LINE THAT FIXES THE ERROR**
            summary: analysisResult.structured_data.summary,
            Dates: analysisResult.structured_data.important_dates || [],
            entites: analysisResult.structured_data.key_terms || [],
            chatHistory: [],
            events:analysisResult.structured_data.events||[],
        };
        console.log(newDocument.data);

        user.files.push(newDocument);
        await user.save(); // This will now succeed because filePath is included
        
        const createdDocument = user.files[user.files.length - 1];

        res.status(200).json({ 
            success: true, 
            data: { 
                file_name: createdDocument.DocumentName,
                structured_data: analysisResult.structured_data,
                extracted_text: analysisResult.extracted_text,
                documentId: createdDocument._id,
            } 
        });

    } catch (error) {
        console.error("💥 UPLOAD CONTROLLER ERROR:", error.message);
        // Clean up the uploaded file if there's an error
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: 'An internal server error occurred on the backend.' });
    }
};

// This function can remain the same
export const getUserDocuments = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('files');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, documents: user.files });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// This function can remain the same
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

// Add this function to your documentController.js

export const downloadDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const document = user.files.id(documentId);
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        // Check if file exists
        if (!document.filePath || !fs.existsSync(document.filePath)) {
            return res.status(404).json({ success: false, message: 'File not found on server' });
        }

        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${document.DocumentName}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Stream the file to the response
        const fileStream = fs.createReadStream(document.filePath);
        fileStream.pipe(res);

    } catch (error) {
        console.error("💥 DOWNLOAD CONTROLLER ERROR:", error.message);
        res.status(500).json({ success: false, message: 'Error downloading document' });
    }
};