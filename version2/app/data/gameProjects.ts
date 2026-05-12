import jdqPrev1 from "./assets/jdq_prev1.png";
import jdqPrev2 from "./assets/jdq_prev2.png";
import jdqPrev3 from "./assets/jdq_prev3.png";

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
    thumbnail: null, // Replace with your image path
    gallery: [
        jdqPrev1.src,
        jdqPrev2.src,
        jdqPrev3.src,
        null,
    ], 
    videoUrl: null, // Replace with your video URL
    accent: "#22c55e",
  },
  {
    id: 2,
    slug: "heritage-quest",
    title: "Heritage Quest",
    shortDesc: "An educational quiz game exploring Dagupan's cultural history through interactive storytelling and trivia.",
    desc: "Heritage Quest is a narrative-driven educational game built to preserve and promote local Dagupan heritage. Players explore historical landmarks through dialogue trees, collect artifact cards, and answer trivia challenges to unlock story chapters. Designed with accessibility in mind — large text, high contrast UI, and keyboard-navigable menus.",
    genre: "Educational Quiz",
    tags: ["Educational", "Quiz Game", "Narrative", "Cultural", "2D"],
    tools: ["Figma", "VS Code", "ibisPaint X"],
    engine: "Custom (Web)",
    status: "Prototype",
    year: "2024",
    thumbnail: null,
    gallery: [null, null, null, null],
    videoUrl: null,
    accent: "#a855f7",
  },
];