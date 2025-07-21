
export interface Complaint {
  id: number;
  description: string;
  reported_by_name: string;
  stadium_name?: string;
  created_at: string | Date;
  status: 'pending' | 'resolved' | 'in_progress';
}

export interface Card {
  subtitle: string;
  text: string;
  backgroundColor: string;
  route: string;
}
