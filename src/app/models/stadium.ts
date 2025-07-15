export interface Stadium {
    id: number;
    name: string;
    address: string;
    google_maps_link: string;
    facilities: string;
    images: string[];
    schedule: {
      sport: string;
      day: string;
      fromTime: string;
      toTime: string;
      maxPlayers: number;
      sportPercentage: number;
    }[];
  }