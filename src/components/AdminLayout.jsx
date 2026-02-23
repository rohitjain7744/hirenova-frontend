import { Link } from "react-router-dom";
import "../styles/Admin.css";

function AdminLayout({ children }) {

  return (
    <div className="admin-layout">

      <aside className="sidebar">
        <h3>Admin Panel</h3>
        <Link to="/admin">Dashboard</Link>
        <Link to="/add-job">Add Job</Link>
        <Link to="/manage-applications">Applications</Link>
      </aside>

      <main className="content">
        {children}
      </main>

    </div>
  );
}

export default AdminLayout;