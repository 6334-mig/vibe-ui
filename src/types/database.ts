export type UserRole = "user" | "admin";

export type ProjectStatus = "published" | "pending" | "rejected" | "flagged" | "approved";

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string | null;
  bio?: string;
  website?: string | null;
  role?: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  user_id?: string;
  author_id?: string;
  title: string;
  description: string;
  tags: string[];
  code?: string;
  html_code?: string;
  slug?: string;
  cover_url?: string | null;
  thumbnail_url?: string | null;
  status: ProjectStatus;
  is_featured: boolean;
  view_count: number;
  avg_rating: number;
  rating_count: number;
  favorite_count: number;
  created_at: string;
  updated_at?: string;
}

export interface Rating {
  id: string;
  project_id: string;
  user_id?: string;
  guest_id?: string;
  rating: number;
  created_at: string;
}

export interface Favorite {
  id: string;
  project_id: string;
  user_id?: string;
  guest_id?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  project_id: string;
  user_id?: string | null;
  guest_id?: string | null;
  guest_name?: string;
  content: string;
  is_hidden?: boolean;
  parent_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CommentWithAuthor extends Comment {
  author?: Profile;
}

export interface ProjectWithAuthor extends Project {
  author?: Profile;
}
