import { Link } from "react-router";

function Header() {
  return (
    <header className="flex h-[80px] w-full items-center justify-between border-b border-gray-200 bg-white px-6 md:px-14">

      <div className="h-11 w-11 shrink-0 rounded-full bg-[#c6c6c6]"></div>

      <nav className="flex items-center gap-3 sm:gap-5 md:gap-8">

        <div className="hidden h-12 w-[140px] items-center gap-3 rounded-full border border-gray-300 bg-[#f7f7f7] px-4 sm:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-gray-500"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            className="w-full min-w-0 bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="relative hidden items-center md:flex">
          <select
            aria-label="Select language"
            defaultValue="English"
            className="cursor-pointer appearance-none bg-transparent py-2 pr-6 text-lg text-gray-800 outline-none"
          >
            <option value="English">English (united States)</option>
            <option value="Hindi">Hindi</option>
            <option value="Bengali">Bengali</option>
            <option value="Punjabi">Punjabi</option>
          </select>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="pointer-events-none absolute right-0 text-gray-800"
          >
            <path d="m7 10 5 5 5-5z" />
          </svg>
        </div>

        <Link
          to="/login"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-black px-3 text-base font-medium text-black transition-colors hover:text-white hover:bg-black md:px-9 md:text-lg"
        >
          Log in
        </Link>

        <Link
          to="/signup"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-black bg-white px-3 text-base font-medium text-black transition-colors hover:text-white hover:bg-black md:px-7 md:text-lg"
        >
          Sign up
        </Link>

      </nav>
    </header>
  );
}

export default Header;