import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LoveConnect - Rencontres et Événements",
    short_name: "LoveConnect",
    description: "Rejoignez notre communauté de 40 000 personnes pour des rencontres et événements exclusifs",
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
