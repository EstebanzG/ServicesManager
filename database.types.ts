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