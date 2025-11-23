interface CoursePayload {
  title: string;
  topic: string;
  description: string;
  modules: ModulePayload[];
}

interface ModulePayload {
  title: string;
  description: string;
  publications: PublicationPayload[];
}

interface PublicationPayload {
  title: string;
  description: string;
  resources: ResourcePayload[];
}

interface ResourcePayload {
  type: string;
  value?: string;
  fileKey?: string;
  fileName?: string;
}
