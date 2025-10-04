
import React, { useState, useEffect, useRef } from 'react';
// --- THIS IS THE MISSING IMPORT ---
import { useLocation, Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import AnalysisDisplay from '../components/AnalysisDisplay';
import DocumentViewer from '../components/DocumentViewer';
import Spinner from '../components/Spinner';
import { FiArrowLeft, FiFileText, FiCpu, FiSend, FiMessageSquare } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatBox = ({ documentId }) => {
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!token || !documentId) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/documents/${documentId}/chat`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) setMessages(data.chatHistory);
            } catch (error) {
                console.error("Failed to fetch chat history", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();

        socketRef.current = io(API_BASE_URL);

        socketRef.current.on('receiveMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });
        
        socketRef.current.on('error', (error) => {
            console.error('Socket Error:', error.message);
            setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        });

        return () => socketRef.current.disconnect();
    }, [documentId, token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const socket = socketRef.current;
        if (currentMessage.trim() && user && socket) {
            const history = messages.map(msg => ({ role: msg.role, content: msg.content }));
            const newMessage = { role: 'user', content: currentMessage };
            
            socket.emit('sendMessage', {
                userId: user._id,
                documentId: documentId,
                question: currentMessage,
                history: [...history, newMessage],
            });

            setMessages((prev) => [...prev, newMessage]);
            setCurrentMessage('');
        }
    };
    
    return (
        <div className="mt-8 pt-6 border-t border-secondary">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                <FiMessageSquare className="mr-3 text-primary" />
                Chat About This Document
            </h2>
            <div className="bg-surface rounded-xl p-4 border border-secondary h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
                    {!isLoading && messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary'}`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="mt-4 flex items-center space-x-2">
                    <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} placeholder="Ask a question..." className="flex-1 bg-background border border-secondary rounded-lg py-2 px-4 focus:outline-none" />
                    <button type="submit" className="bg-primary text-white p-3 rounded-lg" disabled={!currentMessage.trim()}><FiSend /></button>
                </form>
            </div>
        </div>
    );
};

const DocumentDetailPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const { document } = location.state || {};

  if (!document) {
    return <Navigate to="/" />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-sm text-text-secondary hover:text-primary">
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-text-primary mt-2 flex items-center">
            <FiFileText className="mr-3 text-primary" />
            {document.file.name}
        </h1>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-surface rounded-xl p-6 border border-secondary h-[75vh] flex flex-col">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Document Preview</h2>
            <DocumentViewer file={document.file} extractedText={document.extracted_text}/>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-secondary h-[75vh] flex flex-col">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                <FiCpu className="mr-3 text-primary" />
                AI Analysis Report
            </h2>
            <div className="flex-grow overflow-y-auto pr-2">
                <AnalysisDisplay result={document.analysis} />
            </div>
        </div>
      </div>
      <ChatBox documentId={id} />
    </motion.div>
  );
};

export default DocumentDetailPage;