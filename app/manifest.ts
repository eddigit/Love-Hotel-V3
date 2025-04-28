import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Love Hotel Rencontres - Rencontres et Événements",
    short_name: "Love Hotel",
    description:
      "Love Hotel Rencontres vous propose des rencontres exclusives et des événements privés dans nos établissements de luxe. Rejoignez notre communauté de 40 000 membres.",
    start_url: "/",
    display: "standalone",
    background_color: "#1e1e2e",
    theme_color: "#8b5cf6",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
