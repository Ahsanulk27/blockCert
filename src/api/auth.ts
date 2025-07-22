const API_BASE = "http://localhost:5000/api";

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
