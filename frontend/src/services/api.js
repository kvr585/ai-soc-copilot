import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

/* -----------------------------
   Dashboard Investigation
------------------------------ */

export async function investigateAlert(payload) {
  const response = await apiClient.post("/investigate", payload);
  return response.data;
}

/* -----------------------------
   Incident Repository
------------------------------ */

export async function getAllInvestigations() {
  const response = await apiClient.get("/investigations");
  return response.data;
}

export async function getInvestigation(id) {
  const response = await apiClient.get(`/investigations/${id}`);
  return response.data;
}

export async function deleteInvestigation(id) {
  const response = await apiClient.delete(`/investigations/${id}`);
  return response.data;
}

/* -----------------------------
   Dashboard
------------------------------ */

export async function getDashboard() {
  const response = await apiClient.get("/dashboard");
  return response.data;
}

/* -----------------------------
   Executive Report
------------------------------ */

export async function generateExecutiveReport(payload) {
  const response = await apiClient.post(
    "/generate-report",
    payload,
    {
      responseType: "text",
      timeout: 60000,
    }
  );

  return response.data;
}