import React from "react";

const SearchBar = () => {
  return (
    <div className="relative">
      <input
        placeholder="Search..."
        className="input border border-gray-400 focus:border-2 px-4 py-2 rounded-xl w-56 transition-all focus:w-64 outline-none"
        name="search"
        type="search"
      />
      <svg
        className="size-6 absolute top-2 right-3 text-gray-500"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default SearchBar;
