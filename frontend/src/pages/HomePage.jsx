import UrlForm from "../components/UrlForm";
import { Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-between items-center px-4 py-4 sm:py-6 lg:py-6 bg-slate-50 text-slate-900 scroll-smooth overflow-y-auto">
      {/* Subtle ambient lighting with smooth float effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[55rem] h-[28rem] bg-gradient-to-tr from-purple-300/30 via-purple-200/20 to-purple-400/20 blur-3xl opacity-70 animate-float"
      />

      {/* Spacer for vertical balance */}
      <div className="hidden lg:block h-2" />

      {/* Center Content: Hero + Card */}
      <div className="relative w-full max-w-xl my-auto py-4">
        {/* Hero Title */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-purple-50 border border-purple-200/80 text-purple-700 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-purple-700 animate-pulse" />
            Shortly · Fast, Free & Minimal
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Make every link <span className="text-purple-700">Shortly.</span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto">
            Paste your long link to generate a clean, instant short URL in
            seconds.
          </p>
        </div>

        {/* Shortener Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-purple-100/50 p-5 sm:p-7 transition-all duration-300">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Shorten URL
            </span>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="text-xs font-medium text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors"
              >
                Dashboard →
              </Link>
            ) : (
              <Link
                to="/auth"
                className="text-xs font-medium text-purple-700 hover:text-purple-900 transition-colors"
              >
                Sign in for Custom Slugs
              </Link>
            )}
          </div>
          <UrlForm />
        </div>
      </div>

      {/* Minimal Bottom Footer */}
      <footer className="relative py-2 text-center text-xs text-slate-400">
        <p>
          © {new Date().getFullYear()} Shortly. Clean, fast & reliable links.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
