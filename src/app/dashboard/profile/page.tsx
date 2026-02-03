"use client";

import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { FaUserCircle, FaCopy, FaPen } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { updateUser } from "@/lib/store/userSlice";

// ==================== 🌻Main Component ====================
export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage || null,
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // useState(initialValue) runs only once on mount.
  // If user arrives later or updates, profileImage will NOT update automatically without useEffect.
  // Auto-refresh if profile image changes (simulate real-time)
  useEffect(() => {
    setProfileImage(user?.profileImage || null);
  }, [user?.profileImage]);

  // syncs local state when user refresh page
  useEffect(() => {
    if (user) {
      setForm({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const loading = toast.loading("Updating profile...");
    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      toast.dismiss(loading);

      if (!res.ok) {
        console.error("Updating the profile failed:", data.error);
        toast.error(data.error || "Update failed");
        return;
      }

      toast.success("Profile updated successfully!");

      //dispatch to update redux state so that other components using this data reflect changes
      dispatch(
        updateUser({
          fullname: form.fullname,
          email: form.email,
          phone: form.phone,
        }),
      );

      setEditing(false);
    } catch (err) {
      toast.dismiss(loading);
      toast.error("Server error");
    }
  };

  const handleCopyAddress = () => {
    if (!user?.walletAddress) return;
    navigator.clipboard.writeText(user.walletAddress);
    toast.success("Wallet address copied!");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const loading = toast.loading("Uploading image...");
    try {
      const res = await fetch("/api/profile/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      toast.dismiss(loading);

      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }

      toast.success("Profile image updated!");

      //dispatch to update redux state so that other components using this data reflect changes
      dispatch(updateUser({ profileImage: data.profileImage }));

      setProfileImage(data.profileImage); // Auto refresh image
    } catch (err) {
      toast.dismiss(loading);
      toast.error("Server error");
    }
  };

  return (
    <Wrapper>
      <ProfileHeader>
        <ProfileImageWrapper onClick={handleUploadClick}>
          {profileImage ? (
            <ProfileImage src={profileImage} alt="Profile Image" />
          ) : (
            <FaUserCircle size={120} color="#fff" />
          )}
          <UploadOverlay>
            Edit <FaCamera />
          </UploadOverlay>
        </ProfileImageWrapper>
        <WalletBox>
          <p>PPE Wallet Address</p>
          <WalletRow>
            <span>{user?.walletAddress || "Loading..."}</span>
            <CopyButton onClick={handleCopyAddress}>
              <FaCopy />
            </CopyButton>
          </WalletRow>
        </WalletBox>
      </ProfileHeader>

      <FormSection>
        <SectionTitle>Profile Details</SectionTitle>

        <FormRow>
          <Label>Full Name</Label>
          <Input
            name="fullname"
            value={form.fullname}
            disabled={!editing}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow>
          <Label>Email</Label>
          <Input
            name="email"
            value={form.email}
            disabled={!editing}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow>
          <Label>Phone</Label>
          <Input
            name="phone"
            value={form.phone}
            disabled={!editing}
            onChange={handleChange}
          />
        </FormRow>

        <ButtonRow>
          {editing ? (
            <>
              <SaveButton onClick={handleSave}>Save</SaveButton>
              <CancelButton onClick={() => setEditing(false)}>
                Cancel
              </CancelButton>
            </>
          ) : (
            <EditButton onClick={() => setEditing(true)}>
              Edit Profile
            </EditButton>
          )}
        </ButtonRow>
      </FormSection>

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </Wrapper>
  );
}

// ==================== 🌸 Styled Components ====================

const Wrapper = styled.div`
  padding: 30px;
  color: #fff;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 50px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  cursor: pointer;

  /* &:hover div {
    opacity: 1;
  } */
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

const UploadOverlay = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0 0 50% 50%;
  /* opacity: 1; */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  transition: opacity 0.2s ease-in-out;
  color: #fff;
  font-weight: bold;
`;

const WalletBox = styled.div`
  flex: 1;
  /* background: #111e44; */
  background: #1f212b;
  padding: 20px;
  border-radius: 12px;

  p {
    color: #f2cc8f;
    font-weight: bold;
    margin-bottom: 10px;
  }
`;

const WalletRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1e2a50;
  padding: 10px;
  border-radius: 8px;
  font-family: monospace;
  word-break: break-all;
`;

const CopyButton = styled.button`
  background: orange;
  border: none;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: #ff8f1f;
  }
`;

const FormSection = styled.div`
  margin-top: 40px;
  /* background: #111b33; */
  background: #1f212b;
  padding: 25px;
  border-radius: 12px;
`;

const SectionTitle = styled.h3`
  color: #f2cc8f;
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #ccc;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background: #000b1a;
  border: 1px solid #444;
  border-radius: 6px;
  color: white;
`;

const ButtonRow = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 15px;
`;

const EditButton = styled.button`
  background: orange;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  color: white;

  &:hover {
    background: #ff8f1f;
  }
`;

const SaveButton = styled(EditButton)`
  background: #28a745;

  &:hover {
    background: #37c758;
  }
`;

const CancelButton = styled(EditButton)`
  background: #dc3545;

  &:hover {
    background: #e25a64;
  }
`;
