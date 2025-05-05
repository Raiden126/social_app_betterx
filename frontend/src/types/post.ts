export type PostProps = {
  post: {
    _id: string;
    title: string;
    text: string;
    content: string[]; // array of image URLs
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    user_id: {
      _id?: string;
      name?: string;
      username?: string;
      profilePicture?: string;
    };
  };
  onLike?: (postId: string) => void;
  isLiked?: boolean;
};