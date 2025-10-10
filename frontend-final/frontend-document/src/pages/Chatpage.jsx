import React, { useState, useRef, useEffect } from "react";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaFilePdf,
  FaRobot,
  FaUser,
  FaDownload,
  FaClock,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaHome,
  FaSpinner,
  FaExclamationTriangle,
  FaList,
  FaTag,
  FaCalendarDay,
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import io from "socket.io-client";

const ChatPage = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showSummary, setShowSummary] = useState(true);

  // Document-specific configurations
  const documentConfigs = {
    employment: {
      icon: <FaUser className="h-6 w-6 text-green-500" />,
      color: "green",
      type: "Employment Contract",
      quickQuestions: [
        "What is the probation period?",
        "Explain salary and benefits",
        "What are working hours?",
        "Termination conditions?",
      ],
    },
    nda: {
      icon: <FaShieldAlt className="h-6 w-6 text-purple-500" />,
      color: "purple",
      type: "NDA Agreement",
      quickQuestions: [
        "How long does confidentiality last?",
        "What information is protected?",
        "What are the legal consequences?",
        "Any exceptions to confidentiality?",
      ],
    },
    lease: {
      icon: <FaHome className="h-6 w-6 text-blue-500" />,
      color: "blue",
      type: "Lease Agreement",
      quickQuestions: [
        "What is the lease duration?",
        "Explain rent payment terms",
        "What are maintenance responsibilities?",
        "How to renew the lease?",
      ],
    },
    service: {
      icon: <FaMoneyBillWave className="h-6 w-6 text-orange-500" />,
      color: "orange",
      type: "Service Agreement",
      quickQuestions: [
        "What is the project scope?",
        "Explain payment terms",
        "What are the deliverables?",
        "Project timeline?",
      ],
    },
    general: {
      icon: <FaFilePdf className="h-6 w-6 text-red-500" />,
      color: "gray",
      type: "Document",
      quickQuestions: [
        "What are the key terms?",
        "Explain important dates",
        "What are my obligations?",
        "Highlight potential concerns",
      ],
    },
  };

  // Detect document type from filename
  const getDocumentType = (filename) => {
    if (!filename) return "general";
    const lowerName = filename.toLowerCase();
    if (lowerName.includes("employment") || lowerName.includes("contract"))
      return "employment";
    if (lowerName.includes("nda") || lowerName.includes("non-disclosure"))
      return "nda";
    if (lowerName.includes("lease") || lowerName.includes("rental"))
      return "lease";
    if (lowerName.includes("service") || lowerName.includes("agreement"))
      return "service";
    return "general";
  };

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fix events data structure - convert objects to strings
  const fixEventsData = (events) => {
    if (!events || !Array.isArray(events)) return [];

    return events.map((event) => {
      if (typeof event === "string") return event;
      if (typeof event === "object") {
        if (event.event && event.date) {
          return `${event.event} - ${event.date}`;
        } else if (event.event) {
          return event.event;
        } else if (event.date) {
          return event.date;
        } else {
          return JSON.stringify(event);
        }
      }
      return String(event);
    });
  };

  // Fetch document data from backend if not in location state
  const fetchDocumentData = async () => {
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        "https://document-analyzer-1-backend.onrender.com/api/documents",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Find the specific document by ID
          const document = data.documents.find((doc) => doc._id === documentId);
          if (document) {
            // Fix events data structure
            const fixedEvents = fixEventsData(document.events);

            setDocumentData({
              _id: document._id,
              DocumentName: document.DocumentName,
              name: document.DocumentName,
              summary: document.summary || "No summary available",
              Dates: document.Dates || [],
              entites: document.entites || [],
              events: fixedEvents,
              createdAt: document.createdAt,
              uploadTime: formatUploadTime(document.createdAt),
              size: "2.4 MB",
              type: "pdf",
            });
          } else {
            setError("Document not found. Please go back and try again.");
          }
        }
      } else {
        setError("Failed to load document data.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setError("Error loading document. Please try again.");
    }
  };

  // Initialize document data
  useEffect(() => {
    const initializeDocumentData = () => {
      console.log("Location state:", location.state);
      console.log("Document ID from URL:", documentId);

      // First, try to get document from location state
      if (location.state?.document) {
        console.log(
          "Document found in location state:",
          location.state.document
        );
        // Fix events data in location state document too
        const fixedDocument = {
          ...location.state.document,
          events: fixEventsData(location.state.document.events),
        };
        setDocumentData(fixedDocument);
      } else {
        console.log("No document in location state, fetching from backend...");
        // If no state, fetch from backend
        fetchDocumentData();
      }
    };

    initializeDocumentData();
  }, [documentId, location.state]);

  const formatUploadTime = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const documentType = documentData
    ? getDocumentType(documentData.DocumentName || documentData.name)
    : "general";
  const config = documentConfigs[documentType];

  // Socket connection
  useEffect(() => {
    if (!documentData || !user) return;

    console.log("Connecting to socket with document:", documentData._id);

    socketRef.current = io("https://document-analyzer-1-backend.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      setError(null);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    socketRef.current.on("receiveMessage", (data) => {
      console.log("Received message from backend:", data);
      setIsLoading(false);

      // Add AI response to messages
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: data.content,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
      setError("Failed to connect to chat server. Please try again later.");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [documentData, user]);

  // Fetch chat history from backend - IMPROVED VERSION
  // const fetchChatHistory = async (docId) => {
  //   try {
  //     const token = getAuthToken();
  //     if (!token) {
  //       console.error('No token available for fetching chat history');
  //       setMessages([getWelcomeMessage()]);
  //       setIsInitialLoad(false);
  //       return;
  //     }

  //     console.log('Fetching chat history for document:', docId);

  //     const response = await fetch(`https://document-analyzer-1-backend.onrender.com/api/documents/${docId}/chat`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     console.log('Chat history response status:', response.status);

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('Fetched chat history data:', data);

  //       if (data.success) {
  //         if (data.chatHistory && Array.isArray(data.chatHistory) && data.chatHistory.length > 0) {
  //           // Transform backend chat history to frontend format
  //           const formattedMessages = data.chatHistory.map((msg, index) => ({
  //             id: msg._id || `msg-${Date.now()}-${index}`,
  //             text: msg.content || '',
  //             sender: msg.role === 'user' ? 'user' : 'ai',
  //             timestamp: new Date(msg.createdAt || msg.timestamp || Date.now())
  //           }));

  //           console.log('Formatted messages for display:', formattedMessages);
  //           setMessages(formattedMessages);
  //         } else {
  //           // No chat history found, show welcome message
  //           console.log('No chat history found, showing welcome message');
  //           setMessages([getWelcomeMessage()]);
  //         }
  //       } else {
  //         console.log('Backend returned success: false, showing welcome message');
  //         setMessages([getWelcomeMessage()]);
  //       }
  //     } else {
  //       console.error('Failed to fetch chat history, status:', response.status);
  //       // Even if fetch fails, show welcome message
  //       setMessages([getWelcomeMessage()]);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching chat history:', error);
  //     // Show welcome message even if there's an error
  //     setMessages([getWelcomeMessage()]);
  //   } finally {
  //     setIsInitialLoad(false);
  //   }
  // };

  // Fetch chat history from backend - FIXED VERSION
  const fetchChatHistory = async (docId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No token available for fetching chat history");
        setMessages([getWelcomeMessage()]);
        setIsInitialLoad(false);
        return;
      }

      console.log("Fetching chat history for document:", docId);

      const response = await fetch(
        `https://document-analyzer-1-backend.onrender.com/api/documents/${docId}/chat`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Chat history response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Full response data:", data);

        if (data.success && data.chatHistory) {
          console.log("Raw chat history:", data.chatHistory);

          if (Array.isArray(data.chatHistory) && data.chatHistory.length > 0) {
            // Transform backend chat history to frontend format
            const formattedMessages = data.chatHistory.map((msg, index) => {
              // Handle different possible message structures
              let messageText = "";
              let messageSender = "ai";
              let messageTimestamp = new Date();

              if (typeof msg === "string") {
                messageText = msg;
              } else if (typeof msg === "object") {
                // Handle object format from backend
                messageText = msg.content || msg.text || "";
                messageSender =
                  msg.role === "user" || msg.sender === "user" ? "user" : "ai";

                if (msg.createdAt || msg.timestamp) {
                  messageTimestamp = new Date(msg.createdAt || msg.timestamp);
                }
              }

              return {
                id: msg._id || `msg-${Date.now()}-${index}`,
                text: messageText,
                sender: messageSender,
                timestamp: messageTimestamp,
              };
            });

            console.log("Formatted messages for display:", formattedMessages);
            setMessages(formattedMessages);
          } else {
            // No chat history found, show welcome message
            console.log("No chat history found, showing welcome message");
            setMessages([getWelcomeMessage()]);
          }
        } else {
          console.log(
            "Backend returned no chat history, showing welcome message"
          );
          setMessages([getWelcomeMessage()]);
        }
      } else {
        console.error("Failed to fetch chat history, status:", response.status);
        // Try to get error message from response
        try {
          const errorData = await response.json();
          console.error("Error details:", errorData);
        } catch (e) {
          console.error("Could not parse error response");
        }
        // Show welcome message even if there's an error
        setMessages([getWelcomeMessage()]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      // Show welcome message even if there's an error
      setMessages([getWelcomeMessage()]);
    } finally {
      setIsInitialLoad(false);
    }
  };

  // Get welcome message based on document data
  const getWelcomeMessage = () => {
    const documentName =
      documentData?.DocumentName || documentData?.name || "your document";
    const docType = config?.type || "document";

    return {
      id: 1,
      text: `Hello! I'm your AI legal assistant. I've analyzed "${documentName}" and I'm here to help answer any questions about this ${docType}. What would you like to know?`,
      sender: "ai",
      timestamp: new Date(),
    };
  };

  // Fetch chat history when document data is available
  useEffect(() => {
    if (documentData && documentData._id) {
      console.log("Document data available, fetching chat history...");
      fetchChatHistory(documentData._id);
    }
  }, [documentData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages - ENSURES MESSAGES ARE SAVED TO BACKEND
  //   const handleSendMessage = async (e) => {
  //     e.preventDefault();
  //     if (!message.trim() || !user || !documentData || !isConnected) return;

  //     const userMessage = {
  //       id: Date.now(),
  //       text: message,
  //       sender: "user",
  //       timestamp: new Date()
  //     };

  //     // Add user message immediately to UI
  //     setMessages(prev => [...prev, userMessage]);
  //     setMessage("");
  //     setIsLoading(true);

  //     try {
  //       // Prepare history for backend (only user and AI messages, not system messages)
  //       const history = messages
  //         .filter(msg => (msg.sender === 'user' || msg.sender === 'ai') && msg.id !== 1) // Exclude welcome message
  //         .map(msg => ({
  //           role: msg.sender === 'user' ? 'user' : 'assistant',
  //           content: msg.text
  //         }));

  //       console.log("Sending message to backend via Socket.IO:", {
  //         userId: user._id || user.id,
  //         documentId: documentData._id,
  //         question: message,
  //         history: history
  //       });

  //       // Send message via Socket.IO - THIS WILL SAVE TO BACKEND
  //       if (socketRef.current && isConnected) {
  //         socketRef.current.emit('sendMessage', {
  //           userId: user._id || user.id,
  //           documentId: documentData._id,
  //           question: message,
  //           history: history
  //         });
  //       } else {
  //         throw new Error('Socket not connected');
  //       }
  //     } catch (error) {
  //       console.error('Error sending message:', error);
  //       setIsLoading(false);
  //       // Remove the optimistic user message if there was an error
  //       setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));

  //       // Show error message
  //       setMessages(prev => [...prev, {
  //         id: Date.now(),
  //         text: "Sorry, there was an error sending your message. Please check your connection and try again.",
  //         sender: 'ai',
  //         timestamp: new Date()
  //       }]);
  //     }
  //   };

  // Handle sending messages - UPDATED TO MATCH BACKEND STRUCTURE
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user || !documentData || !isConnected) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    // Add user message immediately to UI
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Prepare history for backend (only user and AI messages, not system messages)
      const history = messages
        .filter(
          (msg) =>
            (msg.sender === "user" || msg.sender === "ai") && msg.id !== 1
        ) // Exclude welcome message
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      console.log("Sending message to backend via Socket.IO:", {
        userId: user._id || user.id,
        documentId: documentData._id,
        question: message,
        history: history,
      });

      // Send message via Socket.IO
      if (socketRef.current && isConnected) {
        socketRef.current.emit("sendMessage", {
          userId: user._id || user.id,
          documentId: documentData._id,
          question: message,
          history: history,
        });
      } else {
        throw new Error("Socket not connected");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);

      // Show error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Sorry, there was an error sending your message. Please check your connection and try again.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  };
  const handleBackToDocuments = () => {
    navigate("/documents");
  };

  const handleDownloadDocument = () => {
    if (documentData) {
      alert(`Downloading ${documentData.DocumentName || documentData.name}`);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getColorClasses = (color) => {
    const colorMap = {
      green: {
        bg: "bg-green-500",
        text: "text-green-500",
        light: "bg-green-50",
        border: "border-green-200",
      },
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-500",
        light: "bg-purple-50",
        border: "border-purple-200",
      },
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-500",
        light: "bg-blue-50",
        border: "border-blue-200",
      },
      orange: {
        bg: "bg-orange-500",
        text: "text-orange-500",
        light: "bg-orange-50",
        border: "border-orange-200",
      },
      gray: {
        bg: "bg-gray-500",
        text: "text-gray-500",
        light: "bg-gray-50",
        border: "border-gray-200",
      },
    };
    return colorMap[color] || colorMap.gray;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md text-center">
          <FaExclamationTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToDocuments}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-2 transition duration-200"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  if (!documentData || isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading document and chat history...</p>
        </div>
      </div>
    );
  }

  const colors = getColorClasses(config.color);
  const documentName = documentData.DocumentName || documentData.name;
  const documentSummary =
    documentData.summary || "No summary available for this document.";
  const importantDates = documentData.Dates || [];
  const entities = documentData.entites || [];
  const events = documentData.events || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDocuments}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition duration-200"
              >
                <FaArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Documents</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${colors.light}`}>
                  {config.icon}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {documentName}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaClock className="h-3 w-3" />
                    <span>{documentData.uploadTime}</span>
                    <span>•</span>
                    <span>{documentData.size}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isConnected ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span
                        className={`text-xs ${
                          isConnected ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isConnected ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSummary(!showSummary)}
                className={`flex items-center space-x-2 ${colors.bg} hover:opacity-90 text-white rounded-lg px-4 py-2 transition duration-200`}
              >
                <FaList className="h-4 w-4" />
                <span>{showSummary ? "Hide Summary" : "Show Summary"}</span>
              </button>
              <button
                onClick={handleDownloadDocument}
                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition duration-200"
              >
                <FaDownload className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Summary Section */}
      {showSummary && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Summary Column */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <FaList className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Document Summary
                  </h2>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {documentSummary}
                  </p>
                </div>
              </div>

              {/* Extracted Data Column */}
              <div className="space-y-4">
                {/* Important Dates */}
                {importantDates.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FaCalendarDay className="h-4 w-4 text-green-500" />
                      <h3 className="font-semibold text-gray-900">
                        Important Dates
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {importantDates.map((date, index) => (
                        <div
                          key={index}
                          className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm"
                        >
                          {typeof date === "string"
                            ? date
                            : JSON.stringify(date)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Entities */}
                {entities.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FaTag className="h-4 w-4 text-purple-500" />
                      <h3 className="font-semibold text-gray-900">
                        Key Entities
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {entities.map((entity, index) => (
                        <span
                          key={index}
                          className="bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-2 py-1 text-xs"
                        >
                          {typeof entity === "string"
                            ? entity
                            : JSON.stringify(entity)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events */}
                {events.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FaCalendarAlt className="h-4 w-4 text-orange-500" />
                      <h3 className="font-semibold text-gray-900">
                        Key Events
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {events.map((event, index) => (
                        <div
                          key={index}
                          className="bg-orange-50 border border-orange-200 rounded px-3 py-2 text-sm"
                        >
                          {typeof event === "string"
                            ? event
                            : JSON.stringify(event)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-300px)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex space-x-3 max-w-[80%] ${
                    msg.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === "user" ? colors.bg : "bg-purple-500"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <FaUser className="h-4 w-4 text-white" />
                    ) : (
                      <FaRobot className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.sender === "user"
                        ? `${colors.bg} text-white`
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>

                    {/* Timestamp */}
                    <div
                      className={`text-xs mt-2 ${
                        msg.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <FaRobot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Ask a question about ${documentName}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading || !isConnected}
                />
              </div>
              <button
                type="submit"
                disabled={!message.trim() || isLoading || !isConnected}
                className={`${colors.bg} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 transition duration-200 flex items-center space-x-2`}
              >
                <FaPaperPlane className="h-4 w-4" />
                <span>Send</span>
              </button>
            </form>

            {/* Connection Status */}
            {!isConnected && (
              <div className="mt-2 text-center">
                <p className="text-xs text-red-500 flex items-center justify-center">
                  <FaExclamationTriangle className="w-3 h-3 mr-1" />
                  Connection lost. Reconnecting...
                </p>
              </div>
            )}

            {/* Quick Questions Suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {config.quickQuestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(suggestion)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition duration-200"
                  disabled={isLoading || !isConnected}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
