import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Créer une connexion réutilisable à la base de données Neon
export const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

// Fonction utilitaire pour exécuter des requêtes SQL brutes
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  try {
    // Utiliser sql.query au lieu de l'appel direct comme suggéré dans l'erreur
    return (await sql.query(query, params)) as T
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête SQL:", error)
    throw error
  }
}
