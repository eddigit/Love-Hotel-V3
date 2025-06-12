import { sql } from '@/lib/db'

const testEvents = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Soirée Speed Dating Premium',
    description: 'Une soirée exclusive pour rencontrer des célibataires de qualité dans une ambiance raffinée. Champagne et petits-fours inclus.',
    event_date: '2025-06-20',
    event_time: '19:30:00',
    location: 'Love Hotel - Salon Privé',
    price: 50.00,
    max_participants: 20,
    image: '/speed-dating.jpg',
    category: 'Rencontres',
    creator_id: 'admin-456'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002', 
    title: 'Brunch & Champagne',
    description: 'Un brunch dominical sophistiqué avec champagne rosé, mets fins et ambiance décontractée pour faire de nouvelles rencontres.',
    event_date: '2025-06-22',
    event_time: '11:00:00',
    location: 'Love Hotel - Restaurant',
    price: 35.00,
    max_participants: 30,
    image: '/brunch-champagne.jpg',
    category: 'Gastronomie',
    creator_id: 'admin-456'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Soirée Rideaux Ouverts',
    description: 'Pour les membres aventureux, une soirée spéciale dans nos Love Rooms avec rideaux ouverts. Ambiance libertine garantie.',
    event_date: '2025-06-25',
    event_time: '21:00:00',
    location: 'Love Hotel - Love Rooms',
    price: 80.00,
    max_participants: 16,
    image: '/rideaux-ouverts.jpg',
    category: 'Rideaux ouverts',
    creator_id: 'admin-456'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Masterclass Cocktails',
    description: 'Apprenez à préparer des cocktails signature avec notre barman expert. Dégustation et rencontres dans une ambiance conviviale.',
    event_date: '2025-06-28',
    event_time: '18:00:00',
    location: 'Love Hotel - Bar Lounge',
    price: 25.00,
    max_participants: 15,
    image: '/cocktails-masterclass.jpg',
    category: 'Divertissement',
    creator_id: 'admin-456'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Dîner aux Chandelles',
    description: 'Un dîner romantique avec menu gastronomique 5 services. Parfait pour les couples ou ceux qui cherchent l\'amour.',
    event_date: '2025-07-02',
    event_time: '20:00:00',
    location: 'Love Hotel - Salle à manger privée',
    price: 120.00,
    max_participants: 12,
    image: '/diner-chandelles.jpg',
    category: 'Romantique',
    creator_id: 'admin-456'
  }
]

export async function createTestEvents() {
  try {
    console.log('Création des événements de test...')
    
    for (const event of testEvents) {
      // Vérifier si l'événement existe déjà
      const existing = await sql`
        SELECT id FROM events WHERE id = ${event.id}
      `
      
      if (existing.length === 0) {
        await sql`
          INSERT INTO events (
            id, title, description, event_date, event_time, 
            location, price, max_participants, image, category, creator_id
          ) VALUES (
            ${event.id}, ${event.title}, ${event.description}, 
            ${event.event_date}, ${event.event_time}, ${event.location}, 
            ${event.price}, ${event.max_participants}, ${event.image}, 
            ${event.category}, ${event.creator_id}
          )
        `
        console.log(`✓ Événement créé: ${event.title}`)
      } else {
        console.log(`- Événement existe déjà: ${event.title}`)
      }
    }
    
    console.log('✅ Tous les événements de test ont été créés avec succès!')
    return true
  } catch (error) {
    console.error('❌ Erreur lors de la création des événements:', error)
    return false
  }
}

// Exécuter directement si ce script est appelé
if (require.main === module) {
  createTestEvents().then(() => {
    process.exit(0)
  }).catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
