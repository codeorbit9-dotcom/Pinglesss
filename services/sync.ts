
import { ApiKey, FirewallRule } from "../types";

/**
 * PINGLESS SYNC SERVICE
 * 
 * NOTE: Sync disabled for Vercel Edge Demo. 
 * Vercel Edge Functions do not have built-in KV without external Redis.
 * This service is stubbed to simulate success for the UI.
 */

export const syncToCloudflare = async (keys: ApiKey[], rules: FirewallRule[]) => {
  try {
    console.log(`[Sync] Vercel Edge is stateless. Rules are active in Demo Mode.`);
    
    // Simulated successful sync delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  } catch (error) {
    console.error("[Sync Error]", error);
    return false;
  }
};
