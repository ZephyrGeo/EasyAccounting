import { useState, useEffect, useCallback } from "react";
import { getAllTags as apiGetAllTags } from "@/api/entities/tags";

export function useTags() {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      const tags = await apiGetAllTags();
      setAllTags(tags);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    allTags,
    loading,
    error,
    refreshTags: fetchTags,
  };
}
