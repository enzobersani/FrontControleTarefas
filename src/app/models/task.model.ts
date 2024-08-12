export interface TaskRequest{
    id?: string;
    name?: string;
    projectId?: string;
    collaboratorId?: string;
    page?: number;
    pageSize?: number;
  }

  export interface InsertTask{
    name?: string;
    description?: string;
    projectId?: string;
    collaboratorId?: string;
  }

  export interface UpdateTask{
    id?: string | null;
    name?: string;
    description?: string;
    projectId?: string;
    collaboratorId?: string;
  }

  export interface TaskResultModel {
    id: string;
    name: string;
    description: string;
    projectId: string;
    collaboratorId?: string;
    collaboratorName?: string;
  }
    
  export interface SearchTaskResponseModel {
    count: number;
    totalPages: number;
    hasNext: boolean;
    totalItems: number;
    items?: TaskResultModel[];
  }