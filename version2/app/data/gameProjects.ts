import jdqThumbnail from "./assets/jdq_thumbnail.png";

export interface GameProject {
  id: number;
  slug: string;
  title: string;
  shortDesc: string;
  desc: string;
  genre: string;
  tags: string[];
  tools: string[];
  engine?: string;
  status: "Completed" | "In Progress" | "Prototype";
  year: string;
  thumbnail: string | null;
  gallery: (string | null)[];
  videoUrl: string | null;
  accent: string;
}

export const gameProjects: GameProject[] = [
  {
    id: 1,
    slug: "juander-quiz",
    title: "JuanDer Quiz",
    shortDesc: "An interactive 2D educational quiz game exploring the history, culture, and landmarks of Dagupan City.",
    desc: "JuanDer Quiz is an educational 2D game developed under the JuanDerQuest platform, designed to transform local history learning into an engaging gamified experience. The game features a time-based multiple-choice system where accuracy and response speed directly influence boss encounters via a heart-based health mechanic. It incorporates conditional programming logic, visual feedback, and a performance-based grading system to assess learning outcomes.",    genre: "2D Platformer Asset",
    tags: ["2D", "Educational", "Quiz Game", "Single-player", "Gamification"],
    tools: ["Godot Engine", "GDScript"],
    engine: "Godot Engine",
    status: "Completed",
    year: "2026",
    thumbnail: jdqThumbnail.src,
    gallery: [
        null,
    ], 
    videoUrl: null, // Replace with your video URL
    accent: "#22c55e",
  },
];