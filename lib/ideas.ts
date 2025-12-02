import { supabase } from "./supabase";

export type Idea = {
  id?: string;
  title: string;
  description?: string | null;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export async function getIdeas(): Promise<Idea[]> {
  try {
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error("getIdeas supabase error:", error);
      return [];
    }
    return (data ?? []) as Idea[];
  } catch (err) {
    console.error("getIdeas exception:", err);
    return [];
  }
}

export async function getIdeaById(id: string): Promise<Idea | null> {
  try {
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("getIdeaById supabase error:", error);
      return null;
    }
    return data as Idea;
  } catch (err) {
    console.error("getIdeaById exception:", err);
    return null;
  }
}

export async function createIdea(payload: Partial<Idea>) {
  try {
    const { data, error } = await supabase
      .from("ideas")
      .insert([{ ...payload }])
      .select()
      .single();
    if (error) {
      console.error("createIdea supabase error:", error);
      return { error };
    }
    return { data };
  } catch (err) {
    console.error("createIdea exception:", err);
    return { error: err };
  }
}

export async function updateIdea(id: string, payload: Partial<Idea>) {
  try {
    const { data, error } = await supabase
      .from("ideas")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("updateIdea supabase error:", error);
      return { error };
    }
    return { data };
  } catch (err) {
    console.error("updateIdea exception:", err);
    return { error: err };
  }
}

export async function deleteIdea(id: string) {
  try {
    const { data, error } = await supabase
      .from("ideas")
      .delete()
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("deleteIdea supabase error:", error);
      return { error };
    }
    return { data };
  } catch (err) {
    console.error("deleteIdea exception:", err);
    return { error: err };
  }
}
