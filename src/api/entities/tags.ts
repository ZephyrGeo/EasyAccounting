import { supabase } from "@/lib/supabase";

/**
 * 批量获取或创建标签
 * @param tagNames - 标签名称数组
 * @returns 标签ID数组
 */
export async function getOrCreateTags(tagNames: string[]): Promise<string[]> {
  if (!tagNames || tagNames.length === 0) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");
  const userId = user.id;

  // 清理并去重
  const cleanNames = Array.from(new Set(tagNames.map((n) => n.trim()).filter(Boolean)));

  try {
    // 1. 一次性查询所有已存在的标签
    const { data: existingTags, error: fetchError } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", cleanNames)
      .eq("user_id", userId);

    if (fetchError) throw fetchError;

    const existingNames = existingTags?.map((t) => t.name) || [];
    const existingIds = existingTags?.map((t) => t.id) || [];

    // 2. 找出需要新创建的标签名
    const namesToCreate = cleanNames.filter((name) => !existingNames.includes(name));

    if (namesToCreate.length === 0) {
      return existingIds;
    }

    // 3. 批量插入新标签
    const { data: newTags, error: insertError } = await supabase
      .from("tags")
      .insert(namesToCreate.map((name) => ({ name, user_id: userId })))
      .select("id");

    if (insertError) throw insertError;

    const newIds = newTags?.map((t) => t.id) || [];

    // 返回合并后的所有 ID
    return [...existingIds, ...newIds];
  } catch (error) {
    console.error("Batch processing tags failed:", error);
    return [];
  }
}

/**
 * 获取所有可用标签名称
 */
export async function getAllTags(): Promise<string[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  console.log("Fetching all tags from Supabase...");
  const { data, error } = await supabase.from("tags").select("name").eq("user_id", user.id).order("name");

  if (error) {
    console.error("Failed to fetch all tags:", error);
    return [];
  }

  console.log("Tags fetched successfully:", data);
  return data.map((t) => t.name);
}

/**
 * 彻底从系统中删除标签
 */
export async function deleteTag(tagName: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const cleanName = tagName.trim();
  console.log(`[Database] Attempting to wipe tag: "${cleanName}" for user: ${user.id}`);

  try {
    // 1. 获取 ID（必须匹配 user_id 以通过 RLS）
    const { data: tags, error: fetchError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", cleanName)
      .eq("user_id", user.id);

    if (fetchError) throw fetchError;
    if (!tags || tags.length === 0) {
      console.warn(`[Database] Tag "${cleanName}" not found or unauthorized for this user.`);
      return;
    }

    const tagIds = tags.map((t) => t.id);

    // 2. 强力删除关联
    // 注意：关联表如果也有 RLS，也需要确保有相应的权限。
    const { error: relError } = await supabase.from("transaction_tags").delete().in("tag_id", tagIds);

    if (relError) throw relError;

    // 3. 强力删除主标签
    const { error: delError, status } = await supabase.from("tags").delete().in("id", tagIds).eq("user_id", user.id); // 再次显式带上 user_id

    if (delError) throw delError;

    console.log(`[Database] Delete result: Status ${status}. Tag "${cleanName}" has been successfully removed.`);
  } catch (error) {
    console.error(`[Database] CRITICAL: Failed to delete tag "${cleanName}":`, error);
    throw error;
  }
}
