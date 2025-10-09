
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';


// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(() => {
//     const storedToken = localStorage.getItem('docu-analyzer-token');
//     console.log("🔑 Initial token from localStorage:", storedToken);
//     return storedToken;
//   });
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation(); // Add this to get current location

//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       if (token) {
//         try {
//           const res = await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/me', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });

//           if (res.ok) {
//             const data = await res.json();
//             setUser({ ...data.user, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.email}` });
//           } else {
//             localStorage.removeItem('docu-analyzer-token');
//             setToken(null);
//             setUser(null);
//           }
//         } catch (error) {
//           console.error("Failed to fetch user", error);
//           localStorage.removeItem('docu-analyzer-token');
//           setToken(null);
//           setUser(null);
//         }
//       }
//       setLoading(false);
//     };

//     fetchUser();
//   }, [token]);

//   const signup = async (fullName, email, password) => {
//     try {
//       const res = await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/register', { // Assuming this is your registration endpoint
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ fullName, email, password }),
//       });

//       const data = await res.json(); // Read the response body once

//       if (!res.ok) {
//         // Throw an error with the message from the backend
//         throw new Error(data.message || 'Failed to create account.');
//       }

//       // Return a success object with the backend message
//       return { success: true, message: data.message || 'Account created successfully!' };

//     } catch (error) {
//       console.error("Signup error from context:", error);
//       // Return a failure object with the error message
//       return { success: false, message: error.message };
//     }
//   };


//   const login = async (email, password) => {
//     try {
//       console.log("Attempting login with email:", email);
//       const res = await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
//       console.log("Login response status:", res.status);

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Login failed");
//       }

//       const data = await res.json();
//       localStorage.setItem('docu-analyzer-token', data.token);
//       setToken(data.token);
      
//       return true;

//     } catch (error) {
//       console.error("Login error from context:", error);
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('docu-analyzer-token');
//     setUser(null);
//     setToken(null);
//     navigate('/auth');
//   };

//   // FIX: Only navigate to /documents on login, not every time user is set
//   useEffect(() => {
//     console.log("🔄 User state changed:", { user, currentPath: location.pathname });
    
//     // Only navigate to /documents if we're on the auth page and user logs in
//     if (user && location.pathname === '/auth') {
//       console.log("✅ User logged in, navigating to /documents");
//       navigate('/documents', { replace: true });
//     }
//     // Don't navigate if user is already on a protected page
//   }, [user, navigate, location.pathname]);

//   const value = { user, token, login, logout, isAuthenticated: !!user, loading };

//   return (
//     <AuthContext.Provider value={value}>
//       {children} {/* Remove the loading check here */}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('docu-analyzer-token');
    console.log("🔑 Initial token from localStorage:", storedToken);
    return storedToken;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user data when token changes
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (token) {
        try {
          console.log("🔄 Fetching user data with token...");
          const res = await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/me', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          console.log("User fetch response status:", res.status);

          if (res.ok) {
            const data = await res.json();
            console.log("✅ User data fetched successfully:", data);
            setUser({ 
              ...data.user, 
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.email}` 
            });
          } else {
            console.log("❌ User fetch failed, removing token");
            localStorage.removeItem('docu-analyzer-token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error("💥 Failed to fetch user:", error);
          localStorage.removeItem('docu-analyzer-token');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // const signup = async (fullName, email, password) => {
  //   try {
  //     console.log("📝 Attempting signup with:", { fullName, email });
      
  //     const res = await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/register', {
  //       method: 'POST',
  //       headers: { 
  //         'Content-Type': 'application/json' 
  //       },
  //       body: JSON.stringify({ fullName, email, password }),
  //     });

  //     const data = await res.json();
  //     console.log("Signup response:", data);

  //     if (!res.ok) {
  //       throw new Error(data.message || 'Failed to create account.');
  //     }

  //     return { 
  //       success: true, 
  //       message: data.message || 'Account created successfully!' 
  //     };

  //   } catch (error) {
  //     console.error("💥 Signup error:", error);
  //     return { 
  //       success: false, 
  //       message: error.message 
  //     };
  //   }
  // };

  const signup = async (fullName, email, password) => {
  try {
    console.log("📝 Attempting signup with:", { fullName, email, password });
    
    // Ensure all fields are present and not empty
    if (!fullName || !email || !password) {
      throw new Error('All fields are required');
    }

    const requestBody = {
      name: fullName,  // Try 'name' instead of 'fullName'
      email: email,
      password: password
    };

    console.log("Sending request body:", requestBody);

    const res = await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();
    console.log("Signup response status:", res.status);
    console.log("Signup response data:", data);

    if (!res.ok) {
      throw new Error(data.message || `Signup failed with status ${res.status}`);
    }

    return { 
      success: true, 
      message: data.message || 'Account created successfully!' 
    };

  } catch (error) {
    console.error("💥 Signup error:", error);
    return { 
      success: false, 
      message: error.message 
    };
  }
};

  const login = async (email, password) => {
    try {
      console.log("🔐 Attempting login with email:", email);
      
      const res = await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      console.log("✅ Login successful, received data:", data);
      
      // Store the token
      localStorage.setItem('docu-analyzer-token', data.token);
      setToken(data.token); // This will trigger the useEffect to fetch user data
      
      return true;

    } catch (error) {
      console.error("💥 Login error:", error);
      return false;
    }
  };

  const logout = () => {
    console.log("🚪 Logging out...");
    localStorage.removeItem('docu-analyzer-token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  // Redirect when user is authenticated and on auth page
  useEffect(() => {
    console.log("🔄 Auth state check:", { 
      user, 
      token, 
      isAuthenticated: !!user, 
      currentPath: location.pathname 
    });
    
    if (user && token && location.pathname === '/auth') {
      console.log("✅ User authenticated, navigating to /documents");
      navigate('/documents', { replace: true });
    }
  }, [user, token, navigate, location.pathname]);

  const value = { 
    user, 
    token, 
    login, 
    logout, 
    signup,
    isAuthenticated: !!user, 
    loading 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};