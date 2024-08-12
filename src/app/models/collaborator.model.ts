export interface CollaboratorRequest{
    page?: number;
    pageSize?: number;
  }

  export interface CollaboratorResultModel {
    id: string;
    name: string;
  }
    
  export interface SearchCollaboratorResponseModel {
    count: number;
    totalPages: number;
    hasNext: boolean;
    totalItems: number;
    items?: CollaboratorResultModel[];
  }