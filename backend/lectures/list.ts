import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  createdAt: Date;
  type: "lecture" | "section";
}

export interface ListLecturesParams {
  courseId: Query<string>;
  type?: Query<"lecture" | "section">;
}

export interface ListLecturesResponse {
  lectures: Lecture[];
}

// Retrieves lectures for a specific course.
export const list = api<ListLecturesParams, ListLecturesResponse>(
  { expose: true, method: "GET", path: "/lectures" },
  async (params) => {
    // This will be handled by Firebase on the frontend
    return { lectures: [] };
  }
);
