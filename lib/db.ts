import { neon } from "@neondatabase/serverless"

// Créer une instance de connexion à la base de données
export const sql = neon(process.env.DATABASE_URL!)

// Fonction générique pour exécuter des requêtes SQL
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  try {
    // Utiliser sql.query au lieu de sql directement
    const result = await sql.query(query, params)
    return result.rows as T
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête SQL:", error)
    throw error
  }
}
