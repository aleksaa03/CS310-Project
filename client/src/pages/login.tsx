import { useId, useState } from "react";
import { login } from "../api/services/auth-service";
import { isNullOrEmpty } from "../utils/string";
import { useUser } from "../hooks/use-user";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setCurrentUser } = useUser();

  const navigate = useNavigate();

  const loginUser = async () => {
    const result = await login(username, password);

    if (result.success) {
      setCurrentUser(result.user);
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <h1 className="text-center text-2xl font-bold">Login</h1>
      <input
        type="text"
        name=""
        id={useId()}
        className="mt-5 px-5 py-2 bg-gray-100 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md text-base outline-none"
        value={username}
        placeholder="Username..."
        onKeyUp={async (e) => {
          if (e.key === "Enter") {
            await loginUser();
          }
        }}
        onChange={(e) => {
          if (!isNullOrEmpty(error)) {
            setError("");
          }

          setUsername(e.target.value);
        }}
      />
      <input
        type="password"
        name=""
        id={useId()}
        className="mt-5 px-5 py-2 bg-gray-100 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md text-base outline-none"
        value={password}
        placeholder="Password..."
        onKeyUp={async (e) => {
          if (e.key === "Enter") {
            await loginUser();
          }
        }}
        onChange={(e) => {
          if (!isNullOrEmpty(error)) {
            setError("");
          }

          setPassword(e.target.value);
        }}
      />
      <button
        type="button"
        className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 cursor-pointer"
        onClick={loginUser}
      >
        Login
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Login;
