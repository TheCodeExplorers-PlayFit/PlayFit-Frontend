export interface PlayerPackage {
    id: number;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    sport: string;
    stadium_id: number;
    stadium_name: string;
    start_date: string;
    end_date: string;
  }
  
  export interface PlayerPackageAssignment {
    id: number;
    player_id: number;
    player_name: string;
    package_name: string;
    price: number;
    sport: string;
    stadium_id: number;
    stadium_name: string;
    start_date: string;
    end_date: string;
  }
  
  export interface Stadium {
    id: number;
    name: string;
  }
  
  export interface SubscriptionStats {
    totalPlayers: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    mostPopularPackage: string | null;
  }