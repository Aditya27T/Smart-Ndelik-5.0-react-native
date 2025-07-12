import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Membuat profil user baru di Firestore
 * @param {string} userId - ID user (uid dari Firebase Auth)
 * @param {Object} userData - Data user (username, email, dll)
 * @returns {Promise<boolean>} - Berhasil atau gagal
 */
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: new Date(),
      lastLogin: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return false;
  }
};

/**
 * Mengambil profil user dari Firestore
 * @param {string} userId - ID user
 * @returns {Promise<Object|null>} - Data user atau null jika tidak ditemukan
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

/**
 * Memperbarui profil user di Firestore
 * @param {string} userId - ID user
 * @param {Object} updates - Objek berisi field yang akan diupdate
 * @returns {Promise<boolean>} - Berhasil atau gagal
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

/**
 * Memperbarui foto profil user
 * @param {string} userId - ID user
 * @param {string} photoURL - URL foto baru
 * @returns {Promise<boolean>} - Berhasil atau gagal
 */
export const updateProfilePhoto = async (userId, photoURL) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      profileImage: photoURL,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error updating profile photo:", error);
    return false;
  }
};