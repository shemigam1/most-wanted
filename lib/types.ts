export interface Nomination {
  id: string;
  name: string;
  offense?: string | null;
  userId: string;
  roomId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
