import { api, APIError } from "encore.dev/api";
import type { Course } from "./list";

export interface GetCourseParams {
  id: string;
}

// Retrieves a specific course by ID.
export const get = api<GetCourseParams, Course>(
  { expose: true, method: "GET", path: "/courses/:id" },
  async (params) => {
    // This will be handled by Firebase on the frontend
    throw APIError.notFound("course not found");
  }
);
