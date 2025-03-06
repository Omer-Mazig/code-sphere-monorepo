import { Link } from "react-router";

export const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-2"
    >
      <span className="font-bold text-xl">CodeSphere</span>
    </Link>
  );
};
