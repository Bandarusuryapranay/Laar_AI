import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
  try {
    await auth.signOut(); // Sign out from Firebase
    setUser(null);        // Clear user state
    setIsLoggedIn(false); // Update login status
    
    // Use navigate if you're inside a component, 
    // or window.location for a hard reset
    window.location.href = "/"; 
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // 1. Get the Token
          const token = await firebaseUser.getIdToken();

          // 2. Fetch the "Master Record" from your Backend
          // This ensures the name change and avatar are always pulled from MongoDB
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // 3. MERGE DATA: Combine Firebase Auth + MongoDB Record
          // We keep 'firebaseUser' for methods like .getIdToken() 
          // but overwrite name/avatar with DB data.
          setUser({
            ...firebaseUser,
            ...res.data.user, // Spread backend user (name, avatar, tier, etc.)
            uid: firebaseUser.uid // Ensure the permanent ID is preserved
          });
          
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user metadata:", error);
          // Fallback to just Firebase user if backend fails
          setUser(firebaseUser);
          setIsLoggedIn(true);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

 // Bottom of AuthContext.jsx
return (
  <AuthContext.Provider value={{ user, setUser, loading, isLoggedIn, logout }}>
    {children} 
  </AuthContext.Provider>
);
};