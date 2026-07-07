import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up
  function signup(email, password, fullName) {
    return createUserWithEmailAndPassword(auth, email, password).then(async (result) => {
      // Create user record in Firestore
      const userRef = doc(db, "users", result.user.uid);
      const initialProfile = {
        uid: result.user.uid,
        email: email,
        displayName: fullName || "Volunteer",
        role: email.toLowerCase() === "disha1234@gmail.com" 
          ? "Super Admin" 
          : "Volunteer",
        xp: 100, // Welcome XP
        hours: 0,
        certificatesCount: 0,
        activeProgramsCount: 0,
        createdAt: serverTimestamp(),
        photoURL: ""
      };
      await setDoc(userRef, initialProfile);
      
      const profileRef = doc(db, "profiles", result.user.uid);
      await setDoc(profileRef, {
        fullName: fullName || "Volunteer",
        email: email,
        skills: [],
        bio: "",
        phoneNumber: "",
        location: "",
        updatedAt: serverTimestamp()
      });

      return result.user;
    });
  }

  // Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google Sign In
  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then(async (result) => {
      const userRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        const initialProfile = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || "Google Volunteer",
          role: result.user.email.toLowerCase() === "disha1234@gmail.com"
            ? "Super Admin"
            : "Volunteer",
          xp: 100,
          hours: 0,
          certificatesCount: 0,
          activeProgramsCount: 0,
          createdAt: serverTimestamp(),
          photoURL: result.user.photoURL || ""
        };
        await setDoc(userRef, initialProfile);

        const profileRef = doc(db, "profiles", result.user.uid);
        await setDoc(profileRef, {
          fullName: result.user.displayName || "Google Volunteer",
          email: result.user.email,
          skills: [],
          bio: "",
          phoneNumber: "",
          location: "",
          updatedAt: serverTimestamp()
        });
      }
      return result.user;
    });
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // Reset password
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Verify email
  function verifyEmail() {
    if (auth.currentUser) {
      return sendEmailVerification(auth.currentUser);
    }
  }

  // Set user role or updates (for Admins / Super Admins to manage)
  async function updateUserRole(uid, newRole) {
    const userRef = doc(db, "users", uid);
    return setDoc(userRef, { role: newRole }, { merge: true });
  }

  useEffect(() => {
    let unsubscribeProfile = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Setup realtime profile listener
        const userRef = doc(db, "users", user.uid);
        unsubscribeProfile = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserProfile(snapshot.data());
          } else {
            // Profile doc might not exist yet if signup setDoc is still pending, so set default local state
            setUserProfile({
              role: "Volunteer",
              xp: 0,
              hours: 0,
              displayName: user.displayName || "Volunteer"
            });
          }
          setLoading(false);
        }, (error) => {
          console.warn("Firestore profile read permission blocked: falling back to basic auth user", error.message);
          setUserProfile({
            role: "Volunteer",
            xp: 0,
            hours: 0,
            displayName: user.displayName || user.email?.split("@")[0] || "Volunteer",
            error: error.message
          });
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    verifyEmail,
    updateUserRole,
    isAdmin: ["admin", "superadmin", "super admin"].includes(userProfile?.role?.toLowerCase()),
    isSuperAdmin: ["superadmin", "super admin"].includes(userProfile?.role?.toLowerCase())
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
