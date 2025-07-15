export interface Complaint {
    id: number;
    reported_by: number;
    reported_by_name: string;
    reported_to: string;
    stadium_id: number | null;
    stadium_name: string | null;
    coach_id: number | null;
    description: string;
    status: string;
    created_at: string;
  }
  
  export interface Card {
    subtitle: string;
    text: string;
    backgroundColor: string;
    route: string;
  }