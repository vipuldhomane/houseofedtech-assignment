import api from "@/lib/axios";

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await api.post("/auth/login", data);
  const { token } = res.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }

  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}
