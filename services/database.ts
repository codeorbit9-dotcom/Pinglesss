import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  setDoc,
  getDoc,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "./firebase";
import { ApiKey, FirewallRule, User, PlanType } from "../types";

/**
 * FIRESTORE SECURITY RULES REQUIREMENT
 * 
 * To fix "permission-denied" errors, copy and paste these rules into your 
 * Firebase Console (Firestore -> Rules tab):
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /users/{userId} {
 *       allow read, write: if request.auth != null && request.auth.uid == userId;
 *     }
 *     match /api_keys/{keyId} {
 *       allow read, write, delete: if request.auth != null && (resource == null || resource.data.userId == request.auth.uid);
 *       allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
 *     }
 *     match /firewall_rules/{ruleId} {
 *       allow read, write, delete: if request.auth != null && (resource == null || resource.data.userId == request.auth.uid);
 *       allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
 *     }
 *   }
 * }
 */

export const ensureUserExists = async (firebaseUser: any) => {
  const userRef = doc(db, "users", firebaseUser.uid);
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'Developer',
        plan: 'Free'
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
    return userSnap.data() as User;
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    throw error;
  }
};

export const subscribeToUser = (userId: string, callback: (user: User) => void) => {
  const userRef = doc(db, "users", userId);
  return onSnapshot(userRef, 
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as User);
      }
    },
    (error) => {
      console.warn("Firestore: Missing permissions for user profile. Check Security Rules.", error);
    }
  );
};

export const updateUserPlan = async (userId: string, plan: PlanType) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { plan });
};

export const subscribeToKeys = (userId: string, callback: (keys: ApiKey[]) => void) => {
  const q = query(collection(db, "api_keys"), where("userId", "==", userId));
  return onSnapshot(q, 
    (snapshot) => {
      const keys = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ApiKey[];
      callback(keys);
    },
    (error) => {
      console.warn("Firestore: Missing permissions for API Keys. Check Security Rules.", error);
      callback([]); // Return empty list to prevent stuck loading states
    }
  );
};

export const subscribeToRules = (userId: string, callback: (rules: FirewallRule[]) => void) => {
  const q = query(collection(db, "firewall_rules"), where("userId", "==", userId));
  return onSnapshot(q, 
    (snapshot) => {
      const rules = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirewallRule[];
      callback(rules);
    },
    (error) => {
      console.warn("Firestore: Missing permissions for Firewall Rules. Check Security Rules.", error);
      callback([]);
    }
  );
};

export const getAllUserData = async (userId: string) => {
  try {
    const keysSnap = await getDocs(query(collection(db, "api_keys"), where("userId", "==", userId)));
    const rulesSnap = await getDocs(query(collection(db, "firewall_rules"), where("userId", "==", userId)));
    
    const keys = keysSnap.docs.map(d => ({ id: d.id, ...d.data() })) as ApiKey[];
    const rules = rulesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as FirewallRule[];
    
    return { keys, rules };
  } catch (error) {
    console.error("Error fetching all user data:", error);
    return { keys: [], rules: [] };
  }
};

export const createNewKey = async (userId: string, name: string, targetApiKey?: string, defaultTargetUrl?: string) => {
  const array = new Uint8Array(24);
  window.crypto.getRandomValues(array);
  const keyString = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  const fullKey = `ping_${keyString}`;

  await addDoc(collection(db, "api_keys"), {
    userId,
    name,
    key: fullKey,
    usage: 0,
    limit: 100000,
    status: 'active',
    synced: false,
    targetApiKey: targetApiKey || null,
    defaultTargetUrl: defaultTargetUrl || null,
    createdAt: new Date().toISOString()
  });
};

export const deleteKey = async (keyId: string) => {
  await deleteDoc(doc(db, "api_keys", keyId));
};

export const toggleRule = async (ruleId: string, enabled: boolean) => {
  await updateDoc(doc(db, "firewall_rules", ruleId), { enabled, synced: false });
};

export const addRule = async (userId: string, rule: Omit<FirewallRule, "id" | "createdAt">) => {
  await addDoc(collection(db, "firewall_rules"), {
    ...rule,
    userId,
    synced: false,
    createdAt: new Date().toISOString()
  });
};

export const deleteRule = async (ruleId: string) => {
  await deleteDoc(doc(db, "firewall_rules", ruleId));
};

export const markAllSynced = async (userId: string) => {
  const { keys, rules } = await getAllUserData(userId);
  
  const keyPromises = keys.map(k => updateDoc(doc(db, "api_keys", k.id), { synced: true }));
  const rulePromises = rules.map(r => updateDoc(doc(db, "firewall_rules", r.id), { synced: true }));
  
  await Promise.all([...keyPromises, ...rulePromises]);
};