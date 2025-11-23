export interface ModuleCourseResponse {
  id_module: number;
  id_course: number;
  name_module: string;
  description_module: string;
  status_module: boolean;
  order_index: number;
  date_created: string; // Se suele usar string para fechas en JSON/TypeScript
}
