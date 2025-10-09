// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Accountpage from "./pages/Accountpage";
// import Homepage from "./pages/Homepage";
// import { useAuth } from "./context/Authcontext";
// import Eventspage from "./pages/Eventspage";
// import Yourdocumentspage from "./pages/Yourdocumentspage";
// import { AuthProvider } from "./context/Authcontext";

// const App = () => {
//   const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
  
//   console.log("🛡️ ProtectedRoute check:", { isAuthenticated, loading });
  
//   if (loading) {
//     return <div>Loading...</div>; // Add a proper loading component
//   }
  
//   return isAuthenticated ? children : <Navigate to="/auth" />;
// };

//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Homepage />} />
//         <Route
//           path="/documents"
//           element={
//             <ProtectedRoute>
//               <Yourdocumentspage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/events"
//           element={
//             <ProtectedRoute>
//               <Eventspage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/auth"
//           element={
            
//               <Accountpage />
            
//           }
//         />
//       </Routes>
//     </div>
//   );
// };

// export default App;


// App.js


// App.js
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