// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { createUser, getMe } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const res = await getMe();   // ✅ FIXED
          setProfile(res.data);
        } catch (e) {
          console.error("Failed to fetch profile:", e);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  const register = async (name, email, password, role) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await createUser({
      id: cred.user.uid,
      name,
      email,
      role,
      createdAt: Date.now(),
    });

    const res = await getMe();
    setProfile(res.data);

    return cred.user;
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    const res = await getMe();  // ✅ FIXED
    setProfile(res.data);

    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await getMe();
      setProfile(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const value = useMemo(
    () => ({ user, profile, loading, register, login, logout, refreshProfile }),
    [user, profile, loading, register, login, logout, refreshProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};