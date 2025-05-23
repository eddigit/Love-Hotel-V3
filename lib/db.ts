import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string
export const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || "")

// Function to execute SQL queries with proper error handling
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  try {
    const result = await sql(query, params)
    return result as T
  } catch (error) {
    console.error("Database query failed:", error)
    throw error
  }
}

// Helper function to format dates
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
