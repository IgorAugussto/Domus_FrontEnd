import Navigation from "../components/Navigation";
import { Outlet, useNavigate } from "react-router-dom";
import { authService } from "../service/authService";

export default function PrivateLayout() {
  const navigate = useNavigate();

  const handlePageChange = (page: string) => {
    navigate(`/${page}`);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <>
      <Navigation onPageChange={handlePageChange} onLogout={handleLogout} />
      <div className="p-6">
        <Outlet />
      </div>
    </>
  );
}
