"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/useAuth";
import AuthService from "@/services/auth.service";
import Swal from "sweetalert2";
import { withAuthGuard } from "@/components/withGuard";

interface HRUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    recruitersCreated: number;
  };
}

interface EditUserFormData {
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

 function UserList() {
  const { user } = useAuth();
  const [hrUsers, setHrUsers] = useState<HRUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<HRUser | null>(null);
  const [editFormData, setEditFormData] = useState<EditUserFormData>({
    name: "",
    email: "",
    password: "",
    avatarUrl: "",
  });
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Fetch HR users
  const fetchHRUsers = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.getHRUsers();
      setHrUsers(response.users || []);
    } catch (error: any) {
      console.error("Error fetching HR users:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch users",
        icon: "error",
        confirmButtonColor: "#dc2626",
        customClass: { popup: "rounded-xl" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchHRUsers();
    }
  }, [isAdmin]);

  // Open edit modal
  const openEditModal = (hrUser: HRUser) => {
    setSelectedUser(hrUser);
    setEditFormData({
      name: hrUser.name,
      email: hrUser.email,
      password: "",
      avatarUrl: hrUser.avatarUrl || "",
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setEditFormData({
      name: "",
      email: "",
      password: "",
      avatarUrl: "",
    });
    setEditErrors({});
    setShowPassword(false);
  };

  // Handle edit form input changes
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (editErrors[name as keyof FormErrors]) {
      setEditErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate edit form
  const validateEditForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!editFormData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (editFormData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editFormData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(editFormData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation (only if provided)
    if (editFormData.password && editFormData.password.length > 0) {
      if (editFormData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(editFormData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      }
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEditForm() || !selectedUser) {
      return;
    }

    setIsEditLoading(true);
    setEditErrors({});

    try {
      const updateData: any = {
        name: editFormData.name.trim(),
        email: editFormData.email.trim().toLowerCase(),
        avatarUrl: editFormData.avatarUrl.trim(),
      };

      // Only include password if it's provided
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      await AuthService.updateHRUser(selectedUser.id, updateData);

      // Success notification
      await Swal.fire({
        title: "Success!",
        text: `User "${updateData.name}" has been updated successfully`,
        icon: "success",
        confirmButtonColor: "#10b981",
        confirmButtonText: "OK",
        customClass: { popup: "rounded-xl" },
      });

      // Refresh the user list
      await fetchHRUsers();
      closeEditModal();

    } catch (error: any) {
      console.error("Update user error:", error);
      
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update user. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
        customClass: { popup: "rounded-xl" },
      });

      if (error.message.toLowerCase().includes("email")) {
        setEditErrors({ email: error.message });
      } else {
        setEditErrors({ general: error.message });
      }
    } finally {
      setIsEditLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (hrUser: HRUser) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to delete:</p>
          <div class="bg-gray-100 p-3 rounded-lg">
            <p><strong>Name:</strong> ${hrUser.name}</p>
            <p><strong>Email:</strong> ${hrUser.email}</p>
            <p><strong>Role:</strong> ${hrUser.role}</p>
            ${hrUser._count.recruitersCreated > 0 ? 
              `<p class="text-red-600 mt-2"><strong>⚠️ Warning:</strong> This user has created ${hrUser._count.recruitersCreated} recruiter record(s)</p>` 
              : ''
            }
          </div>
          <p class="mt-3 text-red-600 font-medium">This action cannot be undone!</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete user",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: { popup: "rounded-xl" },
    });

    if (result.isConfirmed) {
      try {
        // Show loading
        Swal.fire({
          title: "Deleting user...",
          text: "Please wait while we delete the user",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        await AuthService.deleteHRUser(hrUser.id);

        // Success notification
        await Swal.fire({
          title: "Deleted!",
          text: `User "${hrUser.name}" has been deleted successfully`,
          icon: "success",
          confirmButtonColor: "#10b981",
          confirmButtonText: "OK",
          customClass: { popup: "rounded-xl" },
        });

        // Refresh the user list
        await fetchHRUsers();

      } catch (error: any) {
        console.error("Delete user error:", error);
        
        Swal.fire({
          title: "Delete Failed",
          text: error.message || "Failed to delete user. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
          confirmButtonText: "OK",
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  // Handle role change
  const handleRoleChange = async (hrUser: HRUser, newRole: string) => {
    const result = await Swal.fire({
      title: "Change User Role",
      html: `
        <div class="text-left">
          <p class="mb-2">Change role for:</p>
          <div class="bg-gray-100 p-3 rounded-lg mb-3">
            <p><strong>Name:</strong> ${hrUser.name}</p>
            <p><strong>Email:</strong> ${hrUser.email}</p>
            <p><strong>Current Role:</strong> ${hrUser.role}</p>
            <p><strong>New Role:</strong> <span class="text-blue-600 font-semibold">${newRole}</span></p>
          </div>
          <p class="text-sm text-gray-600">This will change the user's access permissions.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, change to ${newRole}`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: { popup: "rounded-xl" },
    });

    if (result.isConfirmed) {
      try {
        // Show loading
        Swal.fire({
          title: "Updating role...",
          text: "Please wait while we update the user role",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        await AuthService.changeUserRole(hrUser.id, newRole);

        // Success notification
        await Swal.fire({
          title: "Role Updated!",
          text: `${hrUser.name}'s role has been changed to ${newRole}`,
          icon: "success",
          confirmButtonColor: "#10b981",
          confirmButtonText: "OK",
          customClass: { popup: "rounded-xl" },
        });

        // Refresh the user list
        await fetchHRUsers();

      } catch (error: any) {
        console.error("Role change error:", error);
        
        Swal.fire({
          title: "Role Change Failed",
          text: error.message || "Failed to change user role. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
          confirmButtonText: "OK",
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  // If user is not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Only administrators can view and manage users. Please contact your system administrator if you need access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HR Users Management</h1>
              <p className="text-gray-600">Manage HR users and their permissions</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Total Users: <span className="font-semibold text-gray-900">{hrUsers.length}</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <svg className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      ) : hrUsers.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No HR Users Found</h3>
          <p className="text-gray-600 mb-6">There are no HR users in the system yet.</p>
        </div>
      ) : (
        // Users Table
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recruiters Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hrUsers.map((hrUser) => (
                  <tr key={hrUser.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                          {hrUser.avatarUrl ? (
                            <img
                              src={hrUser.avatarUrl}
                              alt={`${hrUser.name}'s avatar`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling!.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <span className="text-white text-sm font-semibold">
                            {hrUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{hrUser.name}</p>
                          <p className="text-sm text-gray-500">{hrUser.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {hrUser.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium">
                        {hrUser._count.recruitersCreated}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(hrUser.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Role Change Dropdown */}
                        <select
                          value={hrUser.role}
                          onChange={(e) => handleRoleChange(hrUser, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="HR">HR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(hrUser)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteUser(hrUser)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                <button
                  onClick={closeEditModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* General Error */}
                {editErrors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{editErrors.general}</p>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className={`w-full px-3 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 ${
                      editErrors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    placeholder="Enter full name"
                    disabled={isEditLoading}
                  />
                  {editErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className={`w-full px-3 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 ${
                      editErrors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    placeholder="Enter email address"
                    disabled={isEditLoading}
                  />
                  {editErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.email}</p>
                  )}
                </div>

                {/* Avatar URL Field */}
                <div>
                  <label htmlFor="edit-avatarUrl" className="block text-sm font-semibold text-gray-700 mb-1">
                    Avatar URL <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    id="edit-avatarUrl"
                    name="avatarUrl"
                    value={editFormData.avatarUrl}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 transition-all focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-100"
                    placeholder="https://example.com/avatar.jpg"
                    disabled={isEditLoading}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="edit-password" className="block text-sm font-semibold text-gray-700 mb-1">
                    New Password <span className="text-gray-400">(Leave blank to keep current)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="edit-password"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditInputChange}
                      className={`w-full px-3 py-2 pr-10 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 ${
                        editErrors.password
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                      placeholder="Enter new password (optional)"
                      disabled={isEditLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-6.415-6.414m4.243 4.242L12 12l4.242 4.242m0 0L21.536 21.536M16.121 14.121l4.243 4.243" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {editErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.password}</p>
                  )}
                  {editFormData.password && (
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters with uppercase, lowercase, and numbers.
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={isEditLoading}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditLoading}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                      isEditLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    }`}
                  >
                    {isEditLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      "Update User"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuthGuard(UserList);