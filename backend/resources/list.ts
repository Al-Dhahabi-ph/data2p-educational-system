import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";

export interface Resource {
  id: string;
  lectureId: string;
  title: string;
  type: "file" | "audio" | "video";
  originalLink: string;
  embedLink?: string;
  downloadLink?: string;
  viewLink?: string;
  isYouTube: boolean;
  createdAt: Date;
}

export interface ListResourcesParams {
  lectureId: Query<string>;
}

export interface ListResourcesResponse {
  resources: Resource[];
}

// Retrieves resources for a specific lecture.
export const list = api<ListResourcesParams, ListResourcesResponse>(
  { expose: true, method: "GET", path: "/resources" },
  async (params) => {
    // This will be handled by Firebase on the frontend
    return { resources: [] };
  }
);
