import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserLogs } from "../../api/services/user-log-service";
import UserLogTable from "../../components/user-log-table";

const UserLog = () => {
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchUserLogs = async () => {
    const result = await getUserLogs();

    if (result.success) {
      setUserLogs(result.userLogs);
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
    fetchUserLogs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <UserLogTable userLogs={userLogs} />;
};

export default UserLog;
