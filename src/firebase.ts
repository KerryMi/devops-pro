/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { UserProgress } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication Provider
const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

/**
 * Custom error handler for Firestore security rule denials or failures.
 * Encapsulates necessary diagnostics into a structured JSON string.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Signs in user using Google Pop-Up authentication
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

/**
 * Signs up a new user using Email and Password
 */
export async function registerWithEmail(email: string, pass: string, displayName: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(result.user, { displayName });
    return result.user;
  } catch (error) {
    console.error('Email Sign Up Error:', error);
    throw error;
  }
}

/**
 * Signs in an existing user using Email and Password
 */
export async function loginWithEmail(email: string, pass: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error('Email Sign In Error:', error);
    throw error;
  }
}

/**
 * Signs out the current user session
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
}

/**
 * Saves or merges the user progress data in Firestore
 */
export async function saveProgressToFirestore(userId: string, progress: Partial<UserProgress>, isNew: boolean = false) {
  const path = `users/${userId}`;
  try {
    // Sanitize progress keys to prevent un-whitelisted fields from getting through
    const cleanProgress: Record<string, any> = {};
    const whitelistedKeys = [
      'email', 'masteredQuestionIds', 'bookmarkedQuestionIds', 'flashcardBoxes',
      'flashcardLastReview', 'quizResults', 'dailyStreak', 'lastActiveDate',
      'customNotes', 'savedLegend', 'solvedIncidentIds', 'completedInterviewSessionsCount',
      'lastDailyBlitzDate', 'dailyBlitzHistory', 'seenAchievementIds'
    ];

    whitelistedKeys.forEach(key => {
      if (progress[key as keyof UserProgress] !== undefined) {
        cleanProgress[key] = progress[key as keyof UserProgress];
      }
    });

    const payload: any = {
      ...cleanProgress,
      uid: userId,
      updatedAt: serverTimestamp(),
    };

    if (isNew) {
      payload.createdAt = serverTimestamp();
      await setDoc(doc(db, 'users', userId), payload);
    } else {
      await setDoc(doc(db, 'users', userId), payload, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
  }
}

/**
 * Loads the user progress data from Firestore
 */
export async function loadProgressFromFirestore(userId: string): Promise<any> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
