export interface Student {
  id: number;
  firstname: string;
  lastname: string;
  classe: Classe;
}

export interface StudentWithServiceDistrib {
  id: number;
  firstname: string;
  lastname: string;
  classe: Classe;
  service_distribution: ServiceDistribution[];
}

export interface ServiceDistribution {
  id: number;
  student_id: number;
  week_id: number;
  service_id: number;
  monday_periode: number | null;
  thuesday_periode: number | null;
  wednesday_periode: number | null;
  thursday_periode: number | null;
  friday_periode: number | null;
}


export interface Classe {
  id: number
  name: string
}

export interface Week {
  id: number
  name: string
}

export interface Periode {
  id: number
  name: string
}

export interface Service {
  id: number
  name: string
}