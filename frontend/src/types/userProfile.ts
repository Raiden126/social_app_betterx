export interface UserProfile {
    username: string;
    firstname: string;
    lastname: string;
    email?: string;
    bio?: string;
    profilePicture?: string;
    coverImage?: string;
    followerCount: number;
    followingCount: number;
  }
  