import { create } from 'zustand';
import { db, storage, auth } from '../firebase/config';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const useSurpriseStore = create((set, get) => ({
  currentSurprise: null,
  isLoading: false,
  error: null,
  
  createSurprise: async (data) => {
  set({ isLoading: true, error: null });
  try {
    const currentUser = auth.currentUser;
    
    // Check if user is logged in
    if (!currentUser) {
      throw new Error('You must be logged in to create a surprise');
    }
    
    const id = Date.now().toString();
    
    // Create a clean object without undefined values
    const surpriseData = {
      id,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName || currentUser.email,
      createdAt: new Date().toISOString(),
      ...data // Spread the cleaned data
    };
    
    // Remove any undefined values again (safety check)
    Object.keys(surpriseData).forEach(key => {
      if (surpriseData[key] === undefined) {
        delete surpriseData[key];
      }
    });
    
    console.log('Final surprise data being saved:', surpriseData);
    
    await setDoc(doc(db, 'surprises', id), surpriseData);
    set({ currentSurprise: surpriseData, isLoading: false });
    return id;
  } catch (error) {
    console.error('Create surprise error:', error);
    set({ error: error.message, isLoading: false });
    throw error;
  }
},
  
  getSurprise: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'surprises', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        console.log('Retrieved surprise:', data); // Debug log
        set({ currentSurprise: data, isLoading: false });
        return data;
      } else {
        throw new Error('Surprise not found');
      }
    } catch (error) {
      console.error('Get surprise error:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  updateSurprise: async (id, updates) => {
    set({ isLoading: true });
    try {
      const docRef = doc(db, 'surprises', id);
      await updateDoc(docRef, updates);
      const updated = { ...get().currentSurprise, ...updates };
      set({ currentSurprise: updated, isLoading: false });
    } catch (error) {
      console.error('Update surprise error:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  uploadFile: async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'Cache-Control': 'public, max-age=31536000',
        },
      };
      await uploadBytes(storageRef, file, metadata);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
  
  getUserSurprises: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = auth.currentUser;
      console.log('Current user:', currentUser); // Debug log
      
      if (!currentUser) {
        console.log('No user logged in');
        set({ isLoading: false });
        return [];
      }
      
      const surprisesRef = collection(db, 'surprises');
      const q = query(
        surprisesRef, 
        where('userId', '==', currentUser.uid)
      );
      
      console.log('Querying for userId:', currentUser.uid); // Debug log
      
      const querySnapshot = await getDocs(q);
      
      const surprises = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Found surprise:', data); // Debug log
        surprises.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
        });
      });
      
      console.log('Total surprises found:', surprises.length); // Debug log
      
      // Sort by createdAt (newest first)
      surprises.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB - dateA;
      });
      
      set({ isLoading: false });
      return surprises;
    } catch (error) {
      console.error('Error fetching user surprises:', error);
      set({ error: error.message, isLoading: false });
      return [];
    }
  },
  
  deleteSurprise: async (id) => {
    set({ isLoading: true });
    try {
      const docRef = doc(db, 'surprises', id);
      await deleteDoc(docRef);
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Delete surprise error:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useSurpriseStore;