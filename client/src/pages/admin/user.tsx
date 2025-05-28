import { useState, useEffect } from "react";
import UserTable from "../../components/user-table";
import { getUsers } from "../../api/services/user-service";
import { useNavigate } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    const result = await getUsers();

    if (result.success) {
      setUsers(result.users);
    } else {
      if (result.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      setError(result.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <UserTable users={users} refetchUsers={fetchUsers} />;
};

export default User;
