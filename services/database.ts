
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
  getDocs,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import { ApiKey, FirewallRule, User, PlanType } from "../types";

export const ensureUserExists = async (firebaseUser: any) => {
  const userRef = doc(db, "users", firebaseUser.uid);
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
};

export const subscribeToUser = (userId: string, callback: (user: User) => void) => {
  const userRef = doc(db, "users", userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as User);
    }
  });
};

export const updateUserPlan = async (userId: string, plan: PlanType) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { plan });
};

export const subscribeToKeys = (userId: string, callback: (keys: ApiKey[]) => void) => {
  const q = query(collection(db, "api_keys"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const keys = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ApiKey[];
    callback(keys);
  });
};

export const subscribeToRules = (userId: string, callback: (rules: FirewallRule[]) => void) => {
  const q = query(collection(db, "firewall_rules"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const rules = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirewallRule[];
    callback(rules);
  });
};

export const getAllUserData = async (userId: string) => {
  const keysSnap = await getDocs(query(collection(db, "api_keys"), where("userId", "==", userId)));
  const rulesSnap = await getDocs(query(collection(db, "firewall_rules"), where("userId", "==", userId)));
  
  const keys = keysSnap.docs.map(d => ({ id: d.id, ...d.data() })) as ApiKey[];
  const rules = rulesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as FirewallRule[];
  
  return { keys, rules };
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
