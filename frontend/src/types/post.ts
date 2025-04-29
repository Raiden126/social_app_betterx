export interface PostData {
  _id: string; // This matches the "id" in your API response
  user_id: string; // This is the user ID from the API response
  title: string;
  text: string;
  content: string[]; // Array of URLs (images or videos)
  __v: number; // If you need the version key
}

export interface PostResponse {
  success: boolean;
  message: string;
  data: PostData[]; // This should be an array of posts
}
