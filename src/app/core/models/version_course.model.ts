import { ModuleResponse } from './detail_course.model';
import { UserOut } from './user.model';

/**
 * Interfaz que representa el snapshot JSON almacenado en la BD
 * Contiene toda la información del curso en un momento específico
 */
export interface CourseVersionSnapshot {
  image: string;
  id_user: number;
  modules: ModuleResponse[];
  id_theme: number;
  id_course: number;
  is_forked: boolean;
  name_course: string;
  uuid_course: string;
  date_created: string;
  date_updated: string | null;
  status_course: boolean;
  id_author_user: number;
  description_course: string;
}

/**
 * Interfaz que representa la respuesta de un endpoint que obtiene una versión completa
 * Contiene metadatos de la versión + snapshot del curso
 */
export interface CourseVersionResponse {
  id_version: number;
  id_course: number;
  version_number: number;
  snapshot: CourseVersionSnapshot;
  created_at: Date;
  user: UserOut | null;
}

/**
 * Interfaz para listar versiones (sin el snapshot completo)
 */
export interface CourseVersionListResponse {
  id_version: number;
  id_course: number;
  version_number: number;
  created_at: Date;
  user: UserOut | null;
}

/**
 * Alias para compatibilidad con código existente
 * CourseVersionTable = CourseVersionResponse
 */
export type CourseVersionTable = CourseVersionResponse;
