
import ThemeToggle from "@/components/ThemeToggle";

const SearchHeader = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gradient">RAYA</h1>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default SearchHeader;
