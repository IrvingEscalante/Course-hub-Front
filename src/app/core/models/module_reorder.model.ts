export interface ModuleReorderItem {
  id_module: number;
  order_index: number;
}

export interface ModuleReorderRequest {
  modules: ModuleReorderItem[];
}
