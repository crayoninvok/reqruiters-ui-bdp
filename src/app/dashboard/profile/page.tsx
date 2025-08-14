"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { UserService, User } from "@/services/user.service";
import { useAuth } from "@/context/useAuth";
import { withAuthGuard } from "@/components/withGuard";

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Loading states
  const [updateLoading, setUpdateLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Custom SweetAlert2 theme
  const showAlert = (options: any) => {
    return Swal.fire({
      ...options,
      background: "#1e293b",
      color: "#f1f5f9",
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "border border-purple-500/20 shadow-2xl",
        title: "text-slate-100",
        htmlContainer: "text-slate-300",
      },
    });
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await UserService.getCurrentUser();
      setUser(userData);
      setName(userData.name);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = UserService.validateAvatarFile(file);
    if (!validation.isValid) {
      showAlert({
        icon: "error",
        title: "Invalid File",
        text: validation.error || "Invalid file",
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showAlert({
        icon: "error",
        title: "Validation Error",
        text: "Name is required",
      });
      return;
    }

    try {
      setUpdateLoading(true);
      const updatedUser = await UserService.updateProfile(
        { name },
        selectedFile || undefined
      );
      setUser(updatedUser);
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);

      showAlert({
        icon: "success",
        title: "Success!",
        text: "Profile updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Update Failed",
        text: err.message,
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    const result = await showAlert({
      title: "Remove Avatar?",
      text: "Are you sure you want to remove your profile picture?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
    });

    if (!result.isConfirmed) return;

    try {
      setAvatarLoading(true);
      const updatedUser = await UserService.removeAvatar();
      setUser(updatedUser);
      setError(null);

      showAlert({
        icon: "success",
        title: "Removed!",
        text: "Your profile picture has been removed",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Remove Failed",
        text: err.message,
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = UserService.validatePassword(newPassword);
    if (!validation.isValid) {
      showAlert({
        icon: "error",
        title: "Password Validation Error",
        html: `<ul style="text-align: left;">
          ${validation.errors.map((error) => `<li>• ${error}</li>`).join("")}
        </ul>`,
      });
      return;
    }

    try {
      setPasswordLoading(true);
      await UserService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);

      showAlert({
        icon: "success",
        title: "Password Changed!",
        text: "Your password has been updated successfully",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Password Change Failed",
        text: err.message,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!UserService.validateEmail(newEmail)) {
      showAlert({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
      });
      return;
    }

    try {
      setEmailLoading(true);
      const updatedUser = await UserService.updateEmail({
        newEmail,
        password: emailPassword,
      });
      setUser(updatedUser);
      setIsChangingEmail(false);
      setNewEmail("");
      setEmailPassword("");
      setError(null);

      showAlert({
        icon: "success",
        title: "Email Updated!",
        text: "Your email address has been updated successfully",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Email Update Failed",
        text: err.message,
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setName(user?.name || "");
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
        </div>
        <p className="mt-6 text-slate-300 text-lg">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col items-center justify-center p-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-400">Error</h1>
          <p className="text-slate-300 mb-6">
            {error || "Failed to load profile"}
          </p>
          <button
            onClick={fetchUser}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-slate-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative p-8">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                Profile Information
              </h2>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  user.role === "ADMIN"
                    ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30"
                    : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {user.role}
              </span>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-10">
              {/* Avatar Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200">
                  Profile Picture
                </h3>
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-r from-purple-500 to-blue-500">
                      <img
                        src={
                          previewUrl || user.avatarUrl || "/default-avatar.png"
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover bg-slate-700"
                      />
                    </div>
                    {avatarLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                        <div className="animate-spin rounded-full h-10 w-10 border-3 border-purple-500/30 border-t-purple-500"></div>
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                      >
                        Edit Profile
                      </button>
                      {user.avatarUrl && (
                        <button
                          onClick={handleRemoveAvatar}
                          disabled={avatarLoading}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Remove Avatar
                        </button>
                      )}
                    </div>
                  )}

                  {isEditing && (
                    <div className="w-full space-y-4">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="block w-full text-sm text-slate-300 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-blue-600 file:text-white hover:file:from-purple-500 hover:file:to-blue-500 file:transition-all file:duration-300 bg-slate-700/50 border border-slate-600 rounded-lg p-3"
                        />
                      </div>
                      <p className="text-xs text-slate-400 text-center">
                        Accepted formats: JPEG, PNG, GIF, WebP. Max size: 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200">
                  Account Details
                </h3>

                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-400">
                        Full Name
                      </label>
                      <p className="text-xl text-white font-medium">
                        {user.name}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-400">
                        Email Address
                      </label>
                      <p className="text-xl text-white">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-400">
                        Member Since
                      </label>
                      <p className="text-xl text-white">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {updateLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Change Password Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Password Security
                  </h3>
                </div>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {isChangingPassword && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {passwordLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                          <span>Changing...</span>
                        </div>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setError(null);
                      }}
                      className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {!isChangingPassword && (
                <p className="text-slate-400 text-sm">
                  Keep your account secure by regularly updating your password.
                </p>
              )}
            </div>
          </div>

          {/* Change Email Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Email Settings
                  </h3>
                </div>
                {!isChangingEmail && (
                  <button
                    onClick={() => setIsChangingEmail(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                  >
                    Change Email
                  </button>
                )}
              </div>

              {isChangingEmail && (
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      New Email Address
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter new email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm with Password
                    </label>
                    <input
                      type="password"
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={emailLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {emailLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Update Email"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingEmail(false);
                        setNewEmail("");
                        setEmailPassword("");
                        setError(null);
                      }}
                      className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {!isChangingEmail && (
                <div className="space-y-3">
                  <p className="text-slate-400 text-sm">
                    Current email:{" "}
                    <span className="text-white font-medium">{user.email}</span>
                  </p>
                  <p className="text-slate-400 text-sm">
                    Update your email address to receive important
                    notifications.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default withAuthGuard(ProfilePage);