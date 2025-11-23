export interface TaskCardTypes {
  id: string;
  content: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  cards: TaskCardTypes[];
}