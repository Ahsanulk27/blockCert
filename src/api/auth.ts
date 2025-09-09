import axios from "axios";

const API_BASE = "https://blockcert.onrender.com/api";

// Simple function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const registerIssuer = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE}/issuer/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
};

export const loginIssuer = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE}/issuer/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json(); // token and issuer info
};
