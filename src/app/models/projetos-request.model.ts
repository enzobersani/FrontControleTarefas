export interface ProjetoRequest{
  name?: string;
  page?: number;
  pageSize?: number;
}

export interface ProjectResultModel {
  id: string;
  name: string;
}

export interface ProjectAtualizar {
  id?: string;
  name?: string;
}
  
export interface SearchProjectResponseModel {
  count: number;
  totalPages: number;
  hasNext: boolean;
  totalItems: number;
  items?: ProjectResultModel[];
}