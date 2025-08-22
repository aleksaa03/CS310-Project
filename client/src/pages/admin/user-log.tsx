import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUserLogs } from "../../api/services/user-log-service";
import UserLogTable from "../../components/user-log-table";
import { UserLogType } from "../../common/enums";

const UserLog = () => {
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  let page = Number(searchParams.get("page")) || 1;
  let pageSize = Number(searchParams.get("pageSize")) || 10;
  const sortExp = searchParams.get("sortExp");
  const sortOrd = searchParams.get("sortOrd");
  const action = (searchParams.get("action") as UserLogType | null) || null;

  const fetchUserLogs = async () => {
    const result = await getUserLogs(page, pageSize, sortExp, sortOrd, { action });

    if (result.success) {
      setUserLogs(result.userLogs);
      setTotalPages(result.totalPages || 0);
    } else {
      if (result.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      setError(result.message);
    }

    setLoading(false);
  };

  const handleSort = (column: string) => {
    const newOrder = sortExp === column && sortOrd === "ASC" ? "DESC" : "ASC";

    const params: Record<string, string> = {
      page: "1",
      pageSize: pageSize.toString(),
      sortExp: column,
      sortOrd: newOrder,
    };

    if (action) params.action = action.toString();
    setSearchParams(params);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    updateSearchParams(1, newPageSize);
  };

  const updateSearchParams = (newPage: number = page, newPageSize: number = pageSize) => {
    const params: Record<string, string> = {
      page: newPage.toString(),
      pageSize: newPageSize.toString(),
    };

    if (sortExp) params.sortExp = sortExp;
    if (sortOrd) params.sortOrd = sortOrd;
    if (action) params.action = action.toString();

    setSearchParams(params);
  };

  useEffect(() => {
    let isChanged = false;

    if (page > totalPages) {
      page = totalPages;
      isChanged = true;
    }

    if (page < 1) {
      page = 1;
      isChanged = true;
    }

    if (pageSize !== 5 && pageSize !== 10 && pageSize !== 20 && pageSize !== 50 && pageSize !== 100) {
      pageSize = 10;
      isChanged = true;
    }

    if (isChanged) {
      updateSearchParams();
    }

    fetchUserLogs();
  }, [page, pageSize, sortExp, sortOrd, action]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <UserLogTable
      userLogs={userLogs}
      page={page}
      totalPages={totalPages}
      onPageChange={(newPage) => updateSearchParams(newPage)}
      sortExp={sortExp || ""}
      sortOrd={sortOrd || ""}
      onSort={handleSort}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};

export default UserLog;
