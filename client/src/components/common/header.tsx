import { useAuth } from "@/context/auth-context";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../theme-provider";
import { Moon, Sun } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const isLoggedIn = user && user.email;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      setIsOpen(false);
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <header className="w-full   sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-58 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={() => setIsOpen(false)}>
          <div className="text-2xl md:text-3xl font-extrabold text-primary">
            Authify
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4">
          {isLoggedIn ? (
            <>
              <Button variant="outline" className="cursor-pointer">
                {user.name}
              </Button>
              <Dialog>
                <DialogTrigger className="cursor-pointer"><Button >Logout</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader >
                    <DialogTitle className="self-center-safe" >Are you sure you want to logout?</DialogTitle>
                    <DialogDescription className="flex justify-center gap-20 py-2 px-5 items-center">
                      <DialogClose asChild>
                        <Button >Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleLogout} className="cursor-pointer">
                        logout
                      </Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <Link to="/signup">
                <Button variant="outline" className="cursor-pointer">
                  Signup
                </Button>
              </Link>
              <Link to="/login">
                <Button className="cursor-pointer">Login</Button>
              </Link>
            </>
          )}
          <div
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex  items-center cursor-pointer transition-transform duration-500 active:scale-75
                    ${isDark ? "rotate-180" : "rotate-0"}
                    `}
          >
            {isDark ? (
              <Sun className="h-6 w-6  rotate-0 transition-all text-yellow-500" />
            ) : (
              <Moon className="h-6 w-6 rotate-0 transition-all text-blue-500" />
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Menu onClick={() => setIsOpen(!isOpen)} className="cursor-pointer" />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden  shadow-md flex flex-col items-center gap-2 px-4 py-4 transition-all duration-300">
          {isLoggedIn ? (
            <>
              <Button variant="outline" className="w-full" disabled>
                {user.name}
              </Button>
              <Button onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  Signup
                </Button>
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Login</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
