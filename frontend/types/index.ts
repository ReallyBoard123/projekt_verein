export interface Club {
  id: string;
  slug: string;
  name: string;
  category: string;
  location: string;
  memberCount: number;
  foundingYear: number;
  description: string;
  tags: string[];
  matchScore: number;
  latitude?: number;
  longitude?: number;
  isOpenForAll: boolean;
  departments: Department[];
  events: ClubEvent[];
  contact: Contact;
  fees: Fee[];
}

export interface Department {
  id: string;
  name: string;
  memberCount: number;
  ageRange: string;
  trainingTimes: string[];
  icon: string;
}

export interface ClubEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  isOpenForAll: boolean;
  clubId?: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface Fee {
  group: string;
  price: number;
}
