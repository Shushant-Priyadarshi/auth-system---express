
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


interface Props {
  children: React.ReactNode;
}

const RedirectIfAuthenticated = ({ children }: Props) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/"); // or dashboard or home
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return null;

  return <>{children}</>;
};

export default RedirectIfAuthenticated;
