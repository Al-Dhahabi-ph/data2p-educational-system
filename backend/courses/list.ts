import { api } from "encore.dev/api";

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  hasPracticals: boolean;
  theoryProfessors: string[];
  practicalProfessors: string[];
  lectureCount: number;
  sectionCount: number;
  createdAt: Date;
}

export interface ListCoursesResponse {
  courses: Course[];
}

// Retrieves all courses.
export const list = api<void, ListCoursesResponse>(
  { expose: true, method: "GET", path: "/courses" },
  async () => {
    // This will be handled by Firebase on the frontend
    return { courses: [] };
  }
);
