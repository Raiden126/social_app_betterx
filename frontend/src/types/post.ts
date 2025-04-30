export interface PostData {
  _id: string;
  user_id: string;
  title: string;
  text: string;
  username: string;
  content: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PostResponse {
  success: boolean;
  message: string;
  data: PostData[];
}

export interface PostProps {
  _id: string;
  content: string[];
  title: string;
  author: string;
  time: string;
  likesCount: number;
  commentsCount: number;
  currentUserId: string;
}