import { create } from 'zustand';
import { db, storage } from '../firebase/config';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const useSurpriseStore = create((set, get) => ({
  currentSurprise: null,
  isLoading: false,
  error: null,
  
  createSurprise: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const id = Date.now().toString();
      const surpriseData = {
        ...data,
        id,
        createdAt: new Date(),
        status: 'draft',
        views: 0
      };
      
      await setDoc(doc(db, 'surprises', id), surpriseData);
      set({ currentSurprise: surpriseData, isLoading: false });
      return id;
    } catch (error) {
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
        set({ currentSurprise: data, isLoading: false });
        return data;
      } else {
        throw new Error('Surprise not found');
      }
    } catch (error) {
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
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // In your surpriseStore.js, update the uploadFile function
uploadFile: async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    
    // Set metadata with cache control
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'Cache-Control': 'public, max-age=31536000',
        'Content-Disposition': `inline; filename="${file.name}"`,
      },
    };
    
    // Upload with metadata
    await uploadBytes(storageRef, file, metadata);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
},
}));

export default useSurpriseStore;