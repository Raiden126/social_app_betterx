import React, { useEffect, useRef, useState } from "react";
import { userService } from "@/services/userService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/types/userProfile";
import { Loader2, Pencil } from "lucide-react";

const fallbackCover = "/fallbacks/cover-placeholder.jpg";
const fallbackProfile = "/fallbacks/profile-placeholder.png";

const UserAccount = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await userService.getAuthUserProfile();
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    if (type === "profile") {
      setProfileFile(file);
      setProfilePreview(previewURL);
    } else {
      setCoverFile(file);
      setCoverPreview(previewURL);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(user || {});
    setCoverFile(null);
    setProfileFile(null);
    setCoverPreview(null);
    setProfilePreview(null);
  };

  const handleSave = async () => {
    try {
        setLoading(true);
      const form = new FormData();
      if (formData.firstname) form.append("firstname", formData.firstname);
      if (formData.lastname) form.append("lastname", formData.lastname);
      if (formData.bio) form.append("bio", formData.bio);
      if (coverFile) form.append("coverImage", coverFile);
      if (profileFile) form.append("profilePicture", profileFile);

      await userService.updateUserProfile(form);
      await fetchUser();
        setLoading(false);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Cover Image */}
      <div className="relative group">
        <img
          src={coverPreview || user.coverImage || fallbackCover}
          alt="Cover"
          className="w-full h-48 object-cover rounded-md"
        />
        {editMode && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={coverInputRef}
              onChange={(e) => handleFileChange(e, "cover")}
              className="hidden"
            />
            <div
              onClick={() => coverInputRef.current?.click()}
              className="absolute top-2 right-2 bg-white p-1 rounded-full cursor-pointer shadow-md hover:bg-gray-100"
            >
              <Pencil size={18} className="text-black"/>
            </div>
          </>
        )}
        {/* Profile Image */}
        <div className="absolute -bottom-12 left-4 group relative">
          <img
            src={profilePreview || user.profilePicture || fallbackProfile}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
          {editMode && (
            <>
              <input
                type="file"
                accept="image/*"
                ref={profileInputRef}
                onChange={(e) => handleFileChange(e, "profile")}
                className="hidden"
              />
              <div
                onClick={() => profileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-white p-1 rounded-full cursor-pointer shadow-md hover:bg-gray-100"
              >
                <Pencil size={16} className="text-black"/>
              </div>
            </>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="mt-16 pl-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{user.username}</h1>
          {!editMode ? (
            <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Save"}</Button>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex gap-4">
            <span className="text-muted-foreground">{user.followingCount} Following</span>
            <span className="text-muted-foreground">{user.followerCount} Followers</span>
          </div>

          <div className="space-y-2">
            {editMode ? (
              <>
                <Input name="firstname" value={formData.firstname || ""} onChange={handleInputChange} placeholder="First name" />
                <Input name="lastname" value={formData.lastname || ""} onChange={handleInputChange} placeholder="Last name" />
                <Textarea name="bio" value={formData.bio || ""} onChange={handleInputChange} placeholder="Your bio..." />
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-gray-500">{user.bio}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
