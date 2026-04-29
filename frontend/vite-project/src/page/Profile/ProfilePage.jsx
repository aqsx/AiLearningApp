import React, { useEffect, useState } from "react";
import { User, Mail, Calendar, Hash, Lock } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

import axiosinstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changing, setChanging] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosinstance.get(
          API_PATHS.AUTH.GET_PROFILE
        );

        const data =
          res.data?.data ||
          res.data?.user ||
          res.data;

        setUser(data);
      } catch (err) {
        console.error("❌ PROFILE ERROR:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ================= PASSWORD INPUT ================= */
  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setChanging(true);

      await axiosinstance.put(
        API_PATHS.AUTH.CHANGE_PASSWORD,
        {
          currentPassword,
          newPassword,
        }
      );

      toast.success("Password changed successfully");

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Failed to change password"
      );
    } finally {
      setChanging(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <Spinner />
      </div>
    );
  }

  /* ================= FIELD CARD ================= */
  const FieldCard = ({ icon: Icon, label, value }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-emerald-100">
        <Icon className="text-emerald-600" />
      </div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-md font-semibold text-gray-800 break-all">
          {value || "N/A"}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <PageHeader
          title="My Profile"
          subtitle="View and manage your account"
        />
      </div>

      <div className="max-w-4xl mx-auto grid gap-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="text-emerald-600" size={28} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user?.name || "User"}
            </h2>
            <p className="text-gray-500">
              {user?.email || "No email"}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          <FieldCard icon={User} label="Full Name" value={user?.name} />
          <FieldCard icon={Mail} label="Email Address" value={user?.email} />
          <FieldCard icon={Hash} label="User ID" value={user?._id} />
          <FieldCard
            icon={Calendar}
            label="Joined On"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"
            }
          />
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-100">
              <Lock className="text-emerald-600" size={18} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Change Password
            </h3>
          </div>

          <div className="grid gap-4">

            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <Button
              onClick={handleChangePassword}
              disabled={changing}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {changing ? "Updating..." : "Update Password"}
            </Button>

          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <h3 className="text-gray-800 font-medium">
              Account Actions
            </h3>
            <p className="text-sm text-gray-500">
              Manage your session
            </p>
          </div>

          <Button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;