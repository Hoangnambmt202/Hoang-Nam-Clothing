"use client";
import { SearchBarProps } from "@/types/searchbar";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
const SearchBar = ({
  placeholder = "Tìm kiếm...",
  value,
  onChange,
  onSearch,
  className = "w-56 focus:w-64",
}: SearchBarProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      if (onSearch && value !== undefined) {
        onSearch(value);
      }
    }
  };
  
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  const inputProps: any = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      handleSearch(val);
      if (onChange) onChange(val);
    },
    onKeyDown: handleKeyDown,
    placeholder,
    className: "input border border-gray-400 focus:border-2 px-4 py-2 rounded-xl w-full transition-all outline-none text-gray-500",
    name: "search",
    type: "search",
  };

  if (value !== undefined) {
    inputProps.value = value;
  } else {
    inputProps.defaultValue = searchParams.get("query")?.toString() || "";
  }

  return (
    <div className={`relative ${className}`}>
      <input {...inputProps} />
      <button
        onClick={() => {
          if (onSearch && value !== undefined) {
            onSearch(value);
          } else {
            const queryVal = searchParams.get("query")?.toString() || "";
            handleSearch(value !== undefined ? value : queryVal);
          }
        }}
        className="absolute top-2 right-3 text-gray-500 hover:text-black transition-colors"
      >
        <svg
          className="size-6"
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
      </button>
    </div>
  );
};

export default SearchBar;
