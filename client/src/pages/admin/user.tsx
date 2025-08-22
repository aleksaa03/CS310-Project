import { useState, useEffect } from "react";
import UserTable from "../../components/user-table";
import { getUsers } from "../../api/services/user-service";
import { useNavigate, useSearchParams } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  let page = Number(searchParams.get("page")) || 1;
  let pageSize = Number(searchParams.get("pageSize")) || 10;
  const sortExp = searchParams.get("sortExp");
  const sortOrd = searchParams.get("sortOrd");

  const fetchUsers = async () => {
    const result = await getUsers(page, pageSize, sortExp, sortOrd);

    if (result.success) {
      setUsers(result.users);
      setTotalPages(result.totalPages);
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

    fetchUsers();
  }, [page, pageSize, sortExp, sortOrd]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <UserTable
      users={users}
      refetchUsers={fetchUsers}
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

export default User;
