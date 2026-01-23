"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { UserService, User } from "@/services/user.service";
import { useAuth } from "@/context/useAuth";
import { withAuthGuard } from "@/components/withGuard";
import { UserCircle, Edit, Save, X, Camera, Trash2, Lock, Mail, Calendar, Shield, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
    email: false,
  });

  // Loading states
  const [updateLoading, setUpdateLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Custom SweetAlert2 theme
  const showAlert = (options: any) => {
    return Swal.fire({
      ...options,
      background: "#1f2937",
      color: "#f9fafb",
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-xl border border-slate-600/30",
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
        title: "File Tidak Valid",
        text: validation.error || "File tidak valid",
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
        title: "Error Validasi",
        text: "Nama wajib diisi",
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
        title: "Berhasil!",
        text: "Profil berhasil diperbarui",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Gagal Memperbarui",
        text: err.message,
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    const result = await showAlert({
      title: "Hapus Avatar?",
      text: "Apakah Anda yakin ingin menghapus foto profil Anda?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
    });

    if (!result.isConfirmed) return;

    try {
      setAvatarLoading(true);
      const updatedUser = await UserService.removeAvatar();
      setUser(updatedUser);
      setError(null);

      showAlert({
        icon: "success",
        title: "Dihapus!",
        text: "Foto profil Anda telah dihapus",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Gagal Menghapus",
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
        title: "Error Validasi Password",
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
        title: "Password Diubah!",
        text: "Password Anda berhasil diperbarui",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Gagal Mengubah Password",
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
        title: "Email Tidak Valid",
        text: "Masukkan alamat email yang valid",
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
        title: "Email Diperbarui!",
        text: "Alamat email Anda berhasil diperbarui",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Gagal Memperbarui Email",
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
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-slate-800/90 to-gray-800/90 rounded-2xl border border-slate-600/30 shadow-2xl">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full border-4 border-blue-500/20"></div>
          </div>
          <div className="text-center">
            <p className="text-white text-lg sm:text-xl font-semibold mb-2">
              Memuat Profil...
            </p>
            <p className="text-gray-400 text-sm">
              Mengambil informasi akun Anda
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md mx-auto text-center p-6 bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-2xl border border-red-600/30 shadow-xl">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-400">Error</h1>
          <p className="text-gray-300 mb-6">
            {error || "Failed to load profile"}
          </p>
          <button
            onClick={fetchUser}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl">
            <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Pengaturan Profil
            </span>
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-400">
          Kelola informasi akun dan preferensi Anda
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 overflow-hidden">
        <div className="relative p-5 sm:p-6 lg:p-8">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 rounded-full translate-y-12 -translate-x-12 blur-xl"></div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Informasi Profil
            </h2>
            <span
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                user.role === "ADMIN"
                  ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30"
                  : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30"
              }`}
            >
              {user.role}
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 text-red-300 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
            {/* Avatar Section */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-200">
                Foto Profil
              </h3>
              <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                <div className="relative group">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-r from-blue-500 to-purple-500">
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
                      <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500/30 border-t-blue-500"></div>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>

                {!isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Profil</span>
                    </button>
                    {user.avatarUrl && (
                      <button
                        onClick={handleRemoveAvatar}
                        disabled={avatarLoading}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus Avatar</span>
                      </button>
                    )}
                  </div>
                )}

                {isEditing && (
                  <div className="w-full space-y-3 sm:space-y-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white hover:file:from-blue-700 hover:file:to-purple-700 file:transition-all file:duration-300 bg-slate-700/50 border border-slate-600/50 rounded-lg p-3"
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      Format yang diterima: JPEG, PNG, GIF, WebP. Ukuran maks: 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-200">
                Detail Akun
              </h3>

              {!isEditing ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 flex items-center gap-2">
                      <UserCircle className="w-4 h-4" />
                      Nama Lengkap
                    </label>
                    <p className="text-lg sm:text-xl text-white font-medium">
                      {user.name}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Alamat Email
                    </label>
                    <p className="text-lg sm:text-xl text-white">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Anggota Sejak
                    </label>
                    <p className="text-lg sm:text-xl text-white">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Masukkan nama lengkap Anda"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    >
                      {updateLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 border border-slate-600/50"
                    >
                      <X className="w-4 h-4" />
                      <span>Batal</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings Cards */}
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Change Password Card */}
        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
                  <Lock className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Keamanan Password
                </h3>
              </div>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm font-medium flex items-center space-x-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Ubah</span>
                </button>
              )}
            </div>

            {isChangingPassword && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Password Saat Ini
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                      placeholder="Masukkan password saat ini"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword.current ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                      placeholder="Masukkan password baru"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                      placeholder="Konfirmasi password baru"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {passwordLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                        <span>Mengubah...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Ubah Password</span>
                      </>
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
                    className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 border border-slate-600/50"
                  >
                    <X className="w-4 h-4" />
                    <span>Batal</span>
                  </button>
                </div>
              </form>
            )}

            {!isChangingPassword && (
              <p className="text-gray-400 text-sm">
                Jaga keamanan akun Anda dengan rutin memperbarui password.
              </p>
            )}
          </div>
        </div>

        {/* Change Email Card */}
        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Pengaturan Email
                </h3>
              </div>
              {!isChangingEmail && (
                <button
                  onClick={() => setIsChangingEmail(true)}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm font-medium flex items-center space-x-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Ubah</span>
                </button>
              )}
            </div>

            {isChangingEmail && (
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Alamat Email Baru
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="Masukkan alamat email baru"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Konfirmasi dengan Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.email ? "text" : "password"}
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="Masukkan password Anda"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, email: !showPassword.email })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword.email ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {emailLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                        <span>Memperbarui...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Perbarui Email</span>
                      </>
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
                    className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 border border-slate-600/50"
                  >
                    <X className="w-4 h-4" />
                    <span>Batal</span>
                  </button>
                </div>
              </form>
            )}

            {!isChangingEmail && (
              <div className="space-y-2 sm:space-y-3">
                <p className="text-gray-400 text-sm">
                  Email saat ini:{" "}
                  <span className="text-white font-medium">{user.email}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  Perbarui alamat email Anda untuk menerima notifikasi penting.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthGuard(ProfilePage);
