import { api, APIError } from "encore.dev/api";
import type { Lecture } from "./list";

export interface GetLectureParams {
  id: string;
}

// Retrieves a specific lecture by ID.
export const get = api<GetLectureParams, Lecture>(
  { expose: true, method: "GET", path: "/lectures/:id" },
  async (params) => {
    // This will be handled by Firebase on the frontend
    throw APIError.notFound("lecture not found");
  }
);
