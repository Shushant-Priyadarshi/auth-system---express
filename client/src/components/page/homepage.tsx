import { useAuth } from "@/context/auth-context";
import Loader from "../common/loader";

const Homepage = () => {
  const { user, isLoading } = useAuth();
 const isLoggedIn = user && user.email;
 
  if (isLoading && isLoggedIn) return <Loader />;

 

  return (
    <div className="flex w-full justify-center items-center px-4 py-10">
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
  );
};

export default Homepage;
