const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const contentApi = {
  getSiteSettings: () => request("/site-settings"),
  updateSiteSettings: (payload) =>
    request("/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  getHomePage: () => request("/pages/home"),
  updateHomePage: (payload) =>
    request("/admin/pages/home", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  getProjects: () => request("/projects"),
  getProject: (slug) => request(`/projects/${slug}`),
  createProject: (payload) =>
    request("/admin/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateProject: (id, payload) =>
    request(`/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteProject: (id) =>
    request(`/admin/projects/${id}`, {
      method: "DELETE",
    }),
};

