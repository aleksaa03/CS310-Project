import { useEffect, useState } from "react";
import { useUser } from "../hooks/use-user";
import { Navigate } from "react-router-dom";
import { UserRole } from "../common/enums";
import { checkAuth } from "../api/services/auth-service";

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: UserRole[] }) => {
  const { currentUser, setCurrentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const checkUserAuth = async () => {
      const result = await checkAuth(controller.signal);

      if (result.success) {
        if (!result.user) {
          setUnauthorized(true);
          return;
        }

        setCurrentUser(result.user);

        if (!allowedRoles.includes(result.user.roleId)) {
          setForbidden(true);
        }
      } else {
        if (result.status === 401) {
          setUnauthorized(true);
        }
      }

      setLoading(false);
    };

    if (!currentUser) {
      checkUserAuth();
    } else {
      if (!allowedRoles.includes(currentUser.roleId)) {
        setForbidden(true);
      }

      setLoading(false);
    }

    () => controller.abort();
  }, [currentUser, setCurrentUser]);

  if (loading) return null;

  if (unauthorized) return <Navigate to="/login" replace />;
  if (forbidden) return <Navigate to="/forbiden" replace />;

  return children;
};

export default ProtectedRoute;
