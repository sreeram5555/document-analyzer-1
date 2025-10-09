

import React, { useState, useEffect } from "react";
import { 
  FaCalendarAlt, 
  FaFilePdf, 
  FaCheck, 
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaDownload,
  FaFolderOpen,
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import '../stylesheets/eventspage.css'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const Eventspage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState('list');
  const [completedEvents, setCompletedEvents] = useState(new Set());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage as fallback
  const getAuthToken = () => {
    return token || localStorage.getItem('token');
  };

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const authToken = getAuthToken();
      if (!authToken) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      console.log('Fetching events from backend...');
      
      const response = await fetch('https://document-analyzer-1-backend.onrender.com/api/user/events', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Events response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Events data received:', data);
        
        if (data.success && Array.isArray(data.events)) {
          // Transform backend events to frontend format
          const formattedEvents = data.events.map((event, index) => ({
            id: event._id || `event-${index}`,
            document: event.document || "Document",
            title: event.title || event.description || "Event",
            date: event.date || new Date().toISOString().split('T')[0],
            type: new Date(event.date) >= new Date() ? "upcoming" : "past",
            category: event.type || "general"
          }));
          setEvents(formattedEvents);
        } else {
          setEvents([]);
          setError('No events data found');
        }
      } else {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events from server');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    } else {
      setLoading(false);
      setError('Please login to view events');
    }
  }, [isAuthenticated]);

  const upcomingEvents = events.filter(event => event.type === 'upcoming');
  const pastEvents = events.filter(event => event.type === 'past');

  const toggleEventCompletion = (eventId) => {
    setCompletedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleGoToDocuments = () => {
    console.log("🔄 Navigating to documents page...");
    navigate('/documents');
  };

  const formatDate = (dateString) => {
    try {
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return "Invalid date";
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      try {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      } catch (error) {
        return false;
      }
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Calendar generation
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-1 border"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isCurrentDay = isToday(date);
      
      days.push(
        <div 
          key={day} 
          className={`h-24 p-1 border calendar-day ${
            dayEvents.length > 0 ? 'has-event' : ''
          } ${isCurrentDay ? 'current-day' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${
              isCurrentDay ? 'text-white' : 'text-gray-900'
            }`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className={`w-2 h-2 rounded-full ${
                isCurrentDay ? 'bg-white' : 'bg-blue-400'
              }`}></span>
            )}
          </div>
          <div className="mt-1 space-y-1 max-h-16 overflow-y-auto">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id} 
                className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                title={event.title}
              >
                {event.document.split('.')[0]}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{monthYear}</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Today
            </button>
            <button 
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center">
              <span className="text-sm font-medium text-gray-700">{day}</span>
            </div>
          ))}
          {/* Calendar days */}
          {days}
        </div>
      </div>
    );
  };

  const getEventCategoryColor = (category) => {
    const colors = {
      review: 'bg-green-100 text-green-800',
      expiration: 'bg-red-100 text-red-800',
      renewal: 'bg-blue-100 text-blue-800',
      enrollment: 'bg-purple-100 text-purple-800',
      payment: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleRetry = () => {
    fetchEvents();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="ml-3 text-gray-600">Loading events...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back to Documents Button */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Important Dates
            </h1>
            <p className="text-gray-600">
              Key dates and deadlines from your legal documents
            </p>
          </div>
          <button
            onClick={handleGoToDocuments}
            className="flex items-center space-x-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg px-4 py-2 transition duration-200 shadow-sm"
          >
            <FaFolderOpen className="w-4 h-4" />
            <span>My Documents</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-yellow-800">{error}</span>
            </div>
            <button
              onClick={handleRetry}
              className="mt-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm transition duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedView('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === 'list' 
                  ? 'bg-blue-400 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setSelectedView('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === 'calendar' 
                  ? 'bg-blue-400 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Calendar View
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleGoToDocuments}
              className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors md:hidden"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Documents</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <FaDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {selectedView === 'list' ? (
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaCalendarAlt className="w-5 h-5 text-blue-400 mr-2" />
                  Upcoming Events
                </h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {upcomingEvents.length} events
                </span>
              </div>

              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(event => (
                    <div key={event.id} className="event-item bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={completedEvents.has(event.id)}
                          onChange={() => toggleEventCompletion(event.id)}
                          className="event-checkbox mt-1 w-4 h-4 text-blue-400 bg-white border-gray-300 rounded focus:ring-blue-400"
                        />
                        <div className="event-content flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <FaFilePdf className="w-4 h-4 text-red-500" />
                              <span className="font-medium text-gray-900 text-sm">
                                {event.document}
                              </span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${getEventCategoryColor(event.category)}`}>
                              {event.category}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{event.title}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <FaClock className="w-3 h-3" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaCalendarAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No upcoming events found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Events from your documents will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Past Events */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaClock className="w-5 h-5 text-gray-400 mr-2" />
                Past Events
              </h2>

              <div className="space-y-4">
                {pastEvents.length > 0 ? (
                  pastEvents.map(event => (
                    <div key={event.id} className="past-event bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <FaCheck className="w-4 h-4 text-green-500 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <FaFilePdf className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-gray-900 text-sm">
                              {event.document}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{event.title}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <FaClock className="w-3 h-3" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaClock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No past events found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Calendar View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {renderCalendar()}
            </div>
            
            {/* Upcoming Events Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  This Month's Events
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 5).map(event => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        event.category === 'expiration' ? 'bg-red-400' :
                        event.category === 'renewal' ? 'bg-blue-400' :
                        event.category === 'review' ? 'bg-green-400' : 'bg-purple-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.document}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No events this month
                    </p>
                  )}
                </div>
              </div>

              {/* Event Statistics */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Event Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Upcoming Events</span>
                    <span className="font-semibold text-blue-600">{upcomingEvents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed Events</span>
                    <span className="font-semibold text-green-600">{completedEvents.size}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Past Events</span>
                    <span className="font-semibold text-gray-600">{pastEvents.length}</span>
                  </div>
                </div>
                
                {/* Quick Navigation to Documents */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleGoToDocuments}
                    className="flex items-center justify-center space-x-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 transition duration-200"
                  >
                    <FaFolderOpen className="w-4 h-4" />
                    <span>Back to Documents</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Eventspage;