import { useAuth } from "@/context/auth-context";
import Loader from "../common/loader";
import { UserRoundCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const Homepage = () => {
  const { user, isLoading } = useAuth();
 const isLoggedIn = user && user.email;
 
  if (isLoading && isLoggedIn) return <Loader />;

 

  return (
    <div className="relative">
    <div className="flex w-full justify-center items-center mt-7 px-4 py-10">
      <div className="flex flex-col items-center gap-6 max-w-2xl text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          Welcome To <span className="italic text-primary">Authify</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl opacity-70 font-medium">
          A full stack authentication platform
        </p>

        <div className="mt-6 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            {isLoggedIn ? `Hey, ${user.name}!` : "Hey, User!"}
          </h2>

          {isLoggedIn && (
            <>
              <div className="text-lg sm:text-xl font-medium">Email: {user.email}</div>

              <div className="text-base sm:text-lg font-medium">
                {user.emailVerified ? (
                  <div className="text-green-600 space-y-1">
                    <div>Email Verified ✅</div>
                    <div>Cookies Set ✅</div>
                  </div>
                ) : (
                  <span className="text-red-600">❌ Email is not verified</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      
    </div>
    <div className="absolute top-5 right-5 md:top-10 md:right-70 z-100 rotate-5">
            <Badge
              variant="secondary"
              className="bg-blue-500 text-white dark:bg-blue-600"
            >
              <UserRoundCog />
              <p>
                Made By{" "}
                <a href="https://github.com/Shushant-Priyadarshi" target="_blank">Shushant</a>
              </p>
            </Badge>
          </div>
    </div>
  );
};

export default Homepage;
