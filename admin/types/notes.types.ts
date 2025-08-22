export interface NoteAttempt {
  statusCode?: number | null;
  error?: string | null;
  at?: string | null; 
  ok?: boolean | null;
}

export interface Note {
  _id: string;
  createdAt: string; 
  updatedAt: string; 
  body?: string | null;
  attempts: NoteAttempt[];
  title?: string 
}

export interface NotesPagination {
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NotesResponse {
  success: boolean;
  data: Note[];
  pagination: NotesPagination;
}
