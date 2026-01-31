
import { ApiKey, FirewallRule } from "../types";

/**
 * PINGLESS SYNC SERVICE
 */

const CF_ACCOUNT_ID = "YOUR_CLOUDFLARE_ACCOUNT_ID";
const CF_KV_NAMESPACE_ID = "YOUR_KV_NAMESPACE_ID";
const CF_API_TOKEN = "YOUR_CLOUDFLARE_API_TOKEN";

export const syncToCloudflare = async (keys: ApiKey[], rules: FirewallRule[]) => {
  try {
    const bulkData: { key: string; value: string }[] = [];

    // 1. Map Keys
    keys.forEach(k => {
      bulkData.push({
        key: `key:${k.key}`,
        value: JSON.stringify({
          name: k.name,
          usage: k.usage,
          limit: k.limit,
          status: k.status,
          targetApiKey: k.targetApiKey || null, // Critical: sync the target secret
          userId: (k as any).userId
        })
      });
    });

    // 2. Map Firewall Rules
    rules.forEach(r => {
      if (r.enabled && r.action === 'Block') {
        const typeKey = r.type.toLowerCase();
        bulkData.push({
          key: `rule:block:${typeKey}:${r.value}`,
          value: "true"
        });
      }
    });

    if (bulkData.length === 0) return true;

    console.log(`[Sync] Pushing ${bulkData.length} records to Cloudflare Edge...`);
    
    // Simulated successful sync
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  } catch (error) {
    console.error("[Sync Error]", error);
    return false;
  }
};
