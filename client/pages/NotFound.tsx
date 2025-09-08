import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="mx-auto max-w-2xl py-20 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-800">
        404
      </h1>
      <p className="mt-3 text-lg text-slate-600">Oops! Page not found</p>
      <div className="mt-6">
        <Link
          to="/"
          className="rounded-full bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
