import multer from "multer";
import path from "path";
import fs from "fs";
import userModel from "../models/userModel.js";
import axios from "axios";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/uploads/profiles";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage }).array("documents");

export const uploadDocuments = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
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
        message: "Files uploaded and analysis started.",
        files: user.files,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error during file upload." });
    }
  });
};

export const getDocumentChatHistory = async (req, res) => {
  try {
    const { documentId } = req.params;
    const user = await userModel.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const document = user.files.id(documentId);
    if (!document)
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });

    res.status(200).json({ success: true, chatHistory: document.chatHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const ML_AGENT_URL = process.env.ML_AGENT_URL;

    if (!ML_AGENT_URL) {
      console.error("ML_AGENT_URL environment variable is not set");
      return res.status(500).json({
        success: false,
        message: "ML service configuration error",
      });
    }

    const userId = req.user._id.toString();
    const eventsUrl = `${ML_AGENT_URL}/events/${userId}`;

    const response = await axios.get(eventsUrl, {
      timeout: 10000,
    });

    // Transform and deduplicate events
    const eventMap = new Map();

    response.data.forEach((event) => {
      const key = `${event.event_date}-${event.event_description}`;
      if (!eventMap.has(key)) {
        eventMap.set(key, {
          title: event.event_description,
          date: event.event_date,
          document: event.file_name,
          type: getEventType(event.event_description),
        });
      }
    });

    const transformedEvents = Array.from(eventMap.values());

    console.log(
      `Transformed ${response.data.length} events to ${transformedEvents.length} unique events`
    );

    res.status(200).json({
      success: true,
      events: transformedEvents,
    });
  } catch (error) {
    console.error("Error fetching upcoming events:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming events: " + error.message,
    });
  }
};

// Helper function to determine event type based on description
function getEventType(description) {
  const desc = description.toLowerCase();
  if (desc.includes("departure")) return "travel";
  if (desc.includes("arrival")) return "travel";
  if (desc.includes("renewal")) return "renewal";
  if (desc.includes("expiration")) return "expiration";
  if (desc.includes("deadline")) return "deadline";
  return "event";
}
