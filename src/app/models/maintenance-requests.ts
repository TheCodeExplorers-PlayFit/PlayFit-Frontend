
export interface Complaint {
  id: number;
  reported_by: number;
  reported_by_name: string;
  reported_to: string;
  stadium_id: number;
  stadium_name: string;
  owner_id: number;
  owner_name: string;
  owner_email: string;
  coach_id?: number;
  description: string;
  status: 'pending' | 'resolved' | 'in_progress';
  created_at: string;
}


export interface Card {
  subtitle: string;
  text: string;
  class: string;
  route: string;
}
