import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile, clearProfileStatus } from "../redux/slice/auth.slice";
import "../style/z_style.css";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import Spinner from "./Spinner";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, profile, profileLoading, profileError, profileUpdateSuccess } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded._id || decoded.id || decoded.sub; // use the correct field from your token
    } catch (e) {
      userId = null;
    }
  }

  const [editMode, setEditMode] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
    profileImage: "",
    role: "",
    bankDetails: {
      accountHolder: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
    },
  });

  // Fetch user profile on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [dispatch, userId]);

  // Set form state when profile is loaded
  useEffect(() => {
    if (profile) {
      setForm({
        username: profile.username || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        profileImage: profile.profileImage || "https://randomuser.me/api/portraits/women/44.jpg",
        role: profile.role || "",
        bankDetails: {
          accountHolder: profile.bankDetails?.accountHolder || "",
          accountNumber: profile.bankDetails?.accountNumber || "",
          bankName: profile.bankDetails?.bankName || "",
          ifscCode: profile.bankDetails?.ifscCode || "",
        },
      });
      setProfileImg(profile.profileImage || "https://randomuser.me/api/portraits/women/44.jpg");
    }
  }, [profile]);

  // Show success message and exit edit mode after update
  useEffect(() => {
    if (profileUpdateSuccess) {
      setEditMode(false);
      dispatch(clearProfileStatus());
      toast.success("Profile updated successfully!");
    }
  }, [profileUpdateSuccess, dispatch]);

  useEffect(() => {
    if (profileError) {
      toast.error(profileError);
    }
  }, [profileError]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("bankDetails.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset form to profile data
    if (profile) {
      setForm({
        username: profile.username || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        profileImage: profile.profileImage || "https://randomuser.me/api/portraits/women/44.jpg",
        role: profile.role || "",
        bankDetails: {
          accountHolder: profile.bankDetails?.accountHolder || "",
          accountNumber: profile.bankDetails?.accountNumber || "",
          bankName: profile.bankDetails?.bankName || "",
          ifscCode: profile.bankDetails?.ifscCode || "",
        },
      });
      setProfileImg(profile.profileImage || "https://randomuser.me/api/portraits/women/44.jpg");
      setImgFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) return;
    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("phone_number", form.phone_number);
    if (imgFile) {
      formData.append("profileImage", imgFile);
    }
    formData.append("role", form.role);
    formData.append("bankDetails[accountHolder]", form.bankDetails.accountHolder);
    formData.append("bankDetails[accountNumber]", form.bankDetails.accountNumber);
    formData.append("bankDetails[bankName]", form.bankDetails.bankName);
    formData.append("bankDetails[ifscCode]", form.bankDetails.ifscCode);
    dispatch(updateUserProfile({ userId, formData }));
  };

  if (profileLoading && !profile) {
    return <Spinner />;
  }
  if (profileError) {
    return <div className="z_prof_card flex items-center justify-center text-lg text-red-600">{profileError}</div>;
  }

  return (
  <>
  <ToastContainer></ToastContainer>
    <div className="z_prof_card">
      <div className="z_prof_banner" />
      <div className="z_prof_content">
        <div className="z_prof_left">
          <div className="z_flex_button">
            <div
              className="z_prof_avatar_wrapper"
              onClick={() => editMode && fileInputRef.current.click()}
              style={{ cursor: editMode ? "pointer" : "default", position: "relative" }}
            >
              <img src={`http://localhost:5000/uploads/${profileImg}`} alt="Profile" className="z_prof_avatar" />
              {editMode && (
                <span className="profile-camera-overlay">
                  <FaCamera className="profile-camera-icon" />
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageChange}
                disabled={!editMode}
              />
            </div>
            <div className="z_prof_manage">
              <div className="z_prof_name">{form.username || "Username"}</div>
              <div className="z_prof_email">{form.email || "Email"}</div>
            </div>
          </div>
          <div>
            {!editMode ? (
              <button className="z_prof_edit_btn" type="button" onClick={handleEdit}>
                Edit
              </button>
            ) : (
              <button className="z_prof_edit_btn" type="button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </div>
        <form className="z_prof_form" onSubmit={handleSubmit}>
          <div className="z_prof_form_row">
            <div className="z_prof_form_group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="z_prof_form_group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>
          <div className="z_prof_form_row">
            <div className="z_prof_form_group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                placeholder="Enter your phone number"
                value={form.phone_number}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="z_prof_form_group">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={form.role}
                disabled
              />
            </div>
          </div>
          {/* Bank Details Section */}
          <div className="z_prof_form_row">
            <div className="z_prof_form_group">
              <label>Account Holder</label>
              <input
                type="text"
                name="bankDetails.accountHolder"
                placeholder="Account Holder Name"
                value={form.bankDetails.accountHolder}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="z_prof_form_group">
              <label>Account Number</label>
              <input
                type="text"
                name="bankDetails.accountNumber"
                placeholder="Account Number"
                value={form.bankDetails.accountNumber}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>
          <div className="z_prof_form_row">
            <div className="z_prof_form_group">
              <label>Bank Name</label>
              <input
                type="text"
                name="bankDetails.bankName"
                placeholder="Bank Name"
                value={form.bankDetails.bankName}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="z_prof_form_group">
              <label>IFSC Code</label>
              <input
                type="text"
                name="bankDetails.ifscCode"
                placeholder="IFSC Code"
                value={form.bankDetails.ifscCode}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>
          {/* Seller income/withdrawn display */}
          {profile?.role === "seller" && (
            <div className="z_prof_form_row">
              <div className="z_prof_form_group">
                <label>Income</label>
                <input
                  type="text"
                  value={profile.income || 0}
                  disabled
                />
              </div>
              <div className="z_prof_form_group">
                <label>Withdrawn</label>
                <input
                  type="text"
                  value={profile.withdrawn || 0}
                  disabled
                />
              </div>
            </div>
          )}
          {editMode && (
            <div className="z_prof_form_row">
              <div
                className="z_prof_form_group"
                style={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                <button
                  type="submit"
                  className="z_prof_submit_btn"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  </>
  );
}
