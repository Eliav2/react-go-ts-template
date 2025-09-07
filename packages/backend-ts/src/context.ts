import { drizzle } from "drizzle-orm/node-postgres";

// Create database instance
export const db = drizzle(process.env.DATABASE_URL!);

// Define the GraphQL context type
export interface Context {
  db: typeof db;
}

// Create context function
export function createContext(): Context {
  return {
    db,
  };
}
