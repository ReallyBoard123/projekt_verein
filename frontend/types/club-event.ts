// types/club-event.ts

export interface ClubEvent {
  id: string;
  name: string;
  date: string;
  location?: string;
  category?: string;
  isOpenForAll?: boolean;
}
