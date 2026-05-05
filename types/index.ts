import type { ClubEvent } from "./club-event";

// Define the structure for a department
export interface Department {
  id: string;
  name: string;
  // Add any other properties that might exist for a department
  trainingTimes?: any[]; // Example: if trainingTimes are used elsewhere
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  category: string;
  location: string;
  description: string;
  tags: string[];
  latitude?: number;
  longitude?: number;
  contact: {
    email?: string;
    website?: string;
    address?: string;
    phone?: string; 
  };
  summary?: string; 
  events: ClubEvent[];
  departments: Department[]; 
  fees: [];
  matchScore?: number;
  completenessScore?: number;
  memberCount?: number;
  foundingYear?: number;
  isOpenForAll?: boolean;
}

// Export ClubEvent to resolve the import error in EventCard.tsx
export { ClubEvent };
