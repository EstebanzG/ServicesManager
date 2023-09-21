export interface Student {
  id: number;
  firstname: string;
  lastname: string;
  classe: Classe;
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