import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, Search, FileText, FileSpreadsheet, RefreshCw, Eye, ChevronUp, ChevronDown, X } from "lucide-react";
import RoleService from '../usermanagement/RoleService'; // no {}

const RolesPermissions = () => {
  const [rolesData, setRolesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ roleName: "", status: true });
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch roles from API
  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await RoleService.getAllRoles();
      const data = res.data?.rows || res.data || [];
      const normalized = data.map((r, idx) => ({
        key: r.id || r._id || idx + 1,
        role: r.role_name || r.roleName,
        status: r.is_active ? "Active" : "Inactive",
        date: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          : "",
      }));
      setRolesData(normalized);
    } catch (err) {
      console.error("Error fetching roles", err);
      setError("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rolesData, searchText, statusFilter]);

  const applyFilters = () => {
    let filtered = [...rolesData];
    if (searchText) {
      filtered = filtered.filter(
        r =>
          (r.role || "").toLowerCase().includes(searchText.toLowerCase()) ||
          (r.date || "").includes(searchText) ||
          (r.status || "").toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.status.toLowerCase() === statusFilter.toLowerCase());
    }
    setFilteredData(filtered);
    setCurrent(1);
  };

  // Create / Update role
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.roleName.trim()) errors.roleName = "Please enter role name";
    if (Object.keys(errors).length) return setFormErrors(errors);

    // Updated payload to match API
    const payload = { role_name: formData.roleName, is_active: formData.status };

    try {
      if (modalMode === "add") {
        const res = await RoleService.createRole(payload);
        const created = res.data?.data || res.data || payload;

        const newRole = {
          key: created.id || created._id || Math.max(0, ...rolesData.map(r => r.key)) + 1,
          role: created.role_name || payload.role_name,
          date: created.createdAt
            ? new Date(created.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          status: created.is_active ? "Active" : "Inactive",
        };
        setRolesData(prev => [...prev, newRole]);
        alert("Role created successfully");
      } else {
        const res = await RoleService.updateRole(editingRole.key, payload);
        const updated = res.data?.data || res.data || payload;

        setRolesData(prev =>
          prev.map(r =>
            r.key === editingRole.key
              ? { ...r, role: updated.role_name || payload.role_name, status: updated.is_active ? "Active" : "Inactive" }
              : r
          )
        );
        alert("Role updated successfully");
      }
      handleCancel();
    } catch (err) {
      console.error("Create/Update role error", err);
      alert("Failed to save role");
    }
  };

  // Delete role
  const confirmDelete = async () => {
    try {
      await RoleService.deleteRole(deleteConfirm.key);
      setRolesData(prev => prev.filter(r => r.key !== deleteConfirm.key));
      setDeleteConfirm(null);
      alert("Role deleted successfully");
    } catch (err) {
      console.error("Delete role error", err);
      alert("Failed to delete role");
    }
  };

  const handleEdit = (role) => {
    setModalMode("edit");
    setEditingRole(role);
    setFormData({ roleName: role.role, status: role.status === "Active" });
    setFormErrors({});
    setIsModalVisible(true);
  };

  const handleDelete = (role) => setDeleteConfirm(role);

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRole(null);
    setFormData({ roleName: "", status: true });
    setFormErrors({});
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchText("");
    setStatusFilter("all");
    setCurrent(1);
    setSelectedRowKeys([]);
    fetchRoles();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowKeys(paginatedData.map(item => item.key));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectRow = (key) => {
    setSelectedRowKeys(selectedRowKeys.includes(key) ? selectedRowKeys.filter(k => k !== key) : [...selectedRowKeys, key]);
  };

  const paginatedData = filteredData.slice((current - 1) * pageSize, current * pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Roles & Permission</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your roles</p>
        </div>
        <div className="flex gap-2 items-center">
          <button className="w-9 h-9 flex items-center justify-center rounded bg-red-600 text-white hover:bg-red-700" title="Export PDF"><FileText size={16} /></button>
          <button className="w-9 h-9 flex items-center justify-center rounded bg-green-600 text-white hover:bg-green-700" title="Export Excel"><FileSpreadsheet size={16} /></button>
          <button onClick={handleRefresh} disabled={isRefreshing} className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50" title="Refresh">
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50" title="Scroll to Top"><ChevronUp size={16} /></button>
          <button onClick={() => { setModalMode("add"); handleCancel(); setIsModalVisible(true); }} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 h-10 rounded font-medium transition-colors">
            <Plus size={18} /> Add Role
          </button>
        </div>
      </div>

      {/* Search and Status Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search" value={searchText} onChange={e => setSearchText(e.target.value)} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
          {searchText && <button onClick={() => setSearchText("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={18} /></button>}
        </div>
        <div className="relative">
          <button onClick={() => setShowStatusDropdown(!showStatusDropdown)} className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            Status <ChevronDown size={16} />
          </button>
          {showStatusDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button onClick={() => { setStatusFilter("all"); setShowStatusDropdown(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">All Status</button>
              <button onClick={() => { setStatusFilter("active"); setShowStatusDropdown(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Active</button>
              <button onClick={() => { setStatusFilter("inactive"); setShowStatusDropdown(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Inactive</button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-4 border-b border-gray-200">
                <input type="checkbox" checked={paginatedData.length > 0 && paginatedData.every(item => selectedRowKeys.includes(item.key))} onChange={handleSelectAll} className="w-4 h-4 accent-gray-300 cursor-pointer opacity-80" />
              </th>
              <th className="text-left px-4 py-4 border-b border-gray-200 font-medium text-gray-700">Role</th>
              <th className="text-left px-4 py-4 border-b border-gray-200 font-medium text-gray-700">Created Date</th>
              <th className="text-left px-4 py-4 border-b border-gray-200 font-medium text-gray-700">Status</th>
              <th className="w-32 px-4 py-4 border-b border-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((role) => (
              <tr key={role.key} className="hover:bg-gray-50">
                <td className="px-4 py-4 border-b border-gray-100">
                  <input type="checkbox" checked={selectedRowKeys.includes(role.key)} onChange={() => handleSelectRow(role.key)} className="w-4 h-4 accent-gray-300 cursor-pointer opacity-80" />
                </td>
                <td className="px-4 py-4 border-b border-gray-100 text-gray-700 font-medium">{role.role}</td>
                <td className="px-4 py-4 border-b border-gray-100 text-gray-600">{role.date}</td>
                <td className="px-4 py-4 border-b border-gray-100">
                  <span style={{ backgroundColor: role.status === "Active" ? "#3EB780" : "#d63031", color: "#fff", padding: "4px 0px", borderRadius: "4px", fontSize: "12px", fontWeight: "500", display: "inline-block", textAlign: "center", width: "46px" }}>
                    {role.status}
                  </span>
                </td>
                <td className="px-4 py-4 border-b border-gray-100">
                  <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:text-blue-500 hover:border-blue-300"><Eye size={16} /></button>
                    <button onClick={() => handleEdit(role)} className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:text-purple-500 hover:border-purple-300"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(role)} className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:text-red-500 hover:border-red-300"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Row Per Page</span>
          <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="ml-2 px-2 py-1 border border-gray-300 rounded">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
          <span className="ml-2">Entries</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setCurrent(Math.max(1, current - 1))} disabled={current === 1} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50">&lt;</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrent(i + 1)} className={`px-3 py-1 border rounded ${current === i + 1 ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 hover:bg-gray-50"}`}>{i + 1}</button>
          ))}
          <button onClick={() => setCurrent(Math.min(totalPages, current + 1))} disabled={current === totalPages} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50">&gt;</button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{modalMode === "add" ? "Create Role" : "Edit Role"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.roleName} onChange={e => setFormData({ ...formData, roleName: e.target.value })} placeholder="Enter role name" className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${formErrors.roleName ? "border-red-500" : "border-gray-300"}`} />
                {formErrors.roleName && <p className="text-red-500 text-xs mt-1">{formErrors.roleName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setFormData({ ...formData, status: !formData.status })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.status ? "bg-purple-600" : "bg-gray-300"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.status ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className="text-sm text-gray-600">{formData.status ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">{modalMode === "add" ? "Create Role" : "Update Role"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Role</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{deleteConfirm.role}"?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissions;
