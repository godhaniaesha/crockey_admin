import React, { useRef, useState } from "react";
import "../style/z_style.css";

export default function Profile() {
  const [profileImg, setProfileImg] = useState(
    "https://randomuser.me/api/portraits/women/44.jpg"
  );
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="z_prof_card">
      <div className="z_prof_banner" />
      <div className="z_prof_content">
        <div className="z_prof_left">
          <div className="z_flex_button">
            <div
              className="z_prof_avatar_wrapper"
              onClick={() => fileInputRef.current.click()}
            >
              <img src={profileImg} alt="Profile" className="z_prof_avatar" />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            <div className="z_prof_manage">
              <div className="z_prof_name">{form.fullName || "Full Name"}</div>
              <div className="z_prof_email">{form.email || "Email"}</div>
            </div>
          </div>
          <div>
            <button className="z_prof_edit_btn" type="button">
              Edit
            </button>
          </div>
        </div>
        <form className="z_prof_form">
          <div className="z_prof_form_row">
            <div className="z_prof_form_group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
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
              />
            </div>
          </div>
          <div className="z_prof_form_row">
            <div className="z_prof_form_group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter your mobile number"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>
            <div className="z_prof_form_group">
              <label>Gender</label>
              <div style={{ display: "flex", gap: "18px", marginTop: "8px" }}>
                <label style={{ fontWeight: 400 }}>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={form.gender === "Male"}
                    onChange={handleChange}
                  />{" "}
                  Male
                </label>
                <label style={{ fontWeight: 400 }}>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={form.gender === "Female"}
                    onChange={handleChange}
                  />{" "}
                  Female
                </label>
                <label style={{ fontWeight: 400 }}>
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={form.gender === "Other"}
                    onChange={handleChange}
                  />{" "}
                  Other
                </label>
              </div>
            </div>
          </div>
          <div className="z_prof_form_row">
            <div className="z_prof_form_group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
