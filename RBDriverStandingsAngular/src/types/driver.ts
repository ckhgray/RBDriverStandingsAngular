export interface Driver {
    position?: number;
    driver_uuid: string;
    first_name: string;
    last_name: string;
    driver_country_code: string;
    driver_image?: string | null;
    team_uuid: string;
    season_team_name: string;
    season_points: number;
  }
  