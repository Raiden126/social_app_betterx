import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import MainLayout from "../layouts/MainLayout";
import { UserProfile } from "@/types/userProfile";
import { searchUsersService } from "@/services/searchUsersService";
import { useParams } from "react-router-dom";

const fallbackCover = "/fallbacks/cover-placeholder.jpg";
const fallbackProfile = "/fallbacks/profile-placeholder.png";

const UserAccount = () => {
  const { username } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [username]);

  const fetchUser = async () => {
    try {
       if (username) {
         // Viewing another user's profile
         const response = await searchUsersService.viewProfile(username); 
         setUser(response.data[0]);
       } else {
         // Viewing own profile
         const response = await userService.getAuthUserProfile();
         setUser(response.data);
       }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4">
        {/* Cover Image */}
        <div className="relative group">
          <img
            src={coverPreview || user.coverImage || fallbackCover}
            alt="Cover"
            className="w-full h-48 object-cover rounded-md"
          />
          {/* Profile Image */}
          <div className="absolute -bottom-12 left-4 group">
            <img
              src={
                profilePreview || user.profilePicture || "/default_profile.png"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-16 pl-4">
          <div className="mt-4 space-y-3">
            <div className="flex gap-4">
              <span className="text-muted-foreground">
                {user.followingCount} Following
              </span>
              <span className="text-muted-foreground">
                {user.followerCount} Followers
              </span>
              <span className="text-muted-foreground">
                {user.postsCount} Total Posts
              </span>
            </div>

            <div className="space-y-2">
              <>
                <p className="text-lg font-semibold">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-gray-500">{user.bio}</p>
              </>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserAccount;
