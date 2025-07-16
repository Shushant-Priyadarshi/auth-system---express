import { useAuth } from "@/context/auth-context";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigate = useNavigate()
  const isLoggedIn = user && user.email;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login")
      setIsOpen(false); 
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <header className="w-full bg-white  sticky top-0 z-50">
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
              <Button onClick={handleLogout} className="cursor-pointer">
                Logout
              </Button>
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
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Menu
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col items-center gap-2 px-4 py-4 transition-all duration-300">
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
