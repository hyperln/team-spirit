export interface Club {
  established: number;
  name: string;
  id: number;
  logoImageId?: string;
  logoUrl?: string;
  clubColor?: string;
}

export interface Gender {
  id: number;
  name: string;
}
export interface Team {
  gender: number | Gender;
  name: string;
  id: number;
}
