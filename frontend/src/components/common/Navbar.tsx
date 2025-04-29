import { Menu, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useState } from "react";
import { authService } from "@/services/authService";

const Navbar = ({ setIsSidebarOpen }: { setIsSidebarOpen: (val: boolean) => void }) => {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuthCheck();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  if (loading) return null;

  return (
    <div className="w-full bg-black text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-[60]">
      <div className="flex items-center gap-4">
        <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} className="text-white" />
        </button>
        <div className="text-2xl font-bold">
          Better<span className="text-blue-500">X</span>
        </div>
      </div>

      <div className="flex-1 px-4 max-w-md">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 bg-gray-800 text-white border-0 focus:ring-2 focus:ring-blue-500 w-full"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <Button
            variant="secondary"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        ) : (
          <>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://via.placeholder.com/150" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button
              variant="destructive"
              onClick={() => setLogoutDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to logout?</p>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;
