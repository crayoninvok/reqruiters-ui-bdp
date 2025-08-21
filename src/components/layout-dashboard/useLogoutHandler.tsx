import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import Swal from "sweetalert2";

export function useLogoutHandler() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // red-600
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        title: "text-gray-800",
        htmlContainer: "text-gray-600",
      },
    });

    if (result.isConfirmed) {
      try {
        // Show loading alert during logout
        Swal.fire({
          title: "Logging out...",
          text: "Please wait while we securely log you out",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await logout();

        // Show success message
        await Swal.fire({
          title: "Logged out successfully!",
          text: "You have been securely logged out",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "rounded-xl",
          },
        });

        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);

        // Show error message
        Swal.fire({
          title: "Logout Error",
          text: "There was an issue logging you out. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-xl",
          },
        });
      }
    }
  };

  return { handleLogout };
}