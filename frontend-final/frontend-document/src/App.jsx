
import React from "react";
import { Routes, Route } from "react-router-dom";
import Accountpage from "./pages/Accountpage";
import Homepage from "./pages/Homepage";
import Eventspage from "./pages/Eventspage";
import Yourdocumentspage from "./pages/Yourdocumentspage";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatpage from "./pages/Chatpage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Yourdocumentspage />
            </ProtectedRoute>
          }
        />
        <Route path= '/chat/:documentId'
        element={
          <ProtectedRoute>
              <Chatpage/>
            </ProtectedRoute>
        }
        
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Eventspage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<Accountpage />} />
      </Routes>
    </div>
  );
};

export default App;