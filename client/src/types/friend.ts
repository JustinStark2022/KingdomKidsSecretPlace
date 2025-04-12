export interface FriendRequest {
  id: number;
  childId: number;
  friendName: string;
  status: 'pending' | 'approved' | 'denied';
  requestDate: string;
}
