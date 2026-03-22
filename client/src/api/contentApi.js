function resolveApiBaseUrl() {
  const rawValue = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!rawValue) {
    return import.meta.env.DEV ? "/api" : "http://127.0.0.1:4000/api";
  }

  const withProtocol = /^https?:\/\//i.test(rawValue)
    ? rawValue
    : `https://${rawValue}`;

  try {
    const url = new URL(withProtocol);

    if (!url.pathname || url.pathname === "/") {
      url.pathname = "/api";
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return import.meta.env.DEV ? "/api" : "http://127.0.0.1:4000/api";
  }
}

const API_BASE_URL = resolveApiBaseUrl();

async function request(path, options = {}) {
  const { headers: optionHeaders = {}, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...optionHeaders,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function withAdminHeaders(adminKey, options = {}) {
  return {
    ...options,
    headers: {
      ...(options.headers || {}),
      "x-portfolio-key": adminKey,
    },
  };
}

export const contentApi = {
  getSiteSettings: () => request("/site-settings"),
  getAdminBootstrap: (adminKey) =>
    request("/admin/bootstrap", withAdminHeaders(adminKey)),
  updateSiteSettings: (payload, adminKey) =>
    request(
      "/admin/site-settings",
      withAdminHeaders(adminKey, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    ),
  getHomePage: () => request("/pages/home"),
  updateHomePage: (payload, adminKey) =>
    request(
      "/admin/pages/home",
      withAdminHeaders(adminKey, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    ),
  getProjects: () => request("/projects"),
  getProject: (slug) => request(`/projects/${slug}`),
  createProject: (payload, adminKey) =>
    request(
      "/admin/projects",
      withAdminHeaders(adminKey, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    ),
  updateProject: (id, payload, adminKey) =>
    request(
      `/admin/projects/${id}`,
      withAdminHeaders(adminKey, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    ),
  deleteProject: (id, adminKey) =>
    request(
      `/admin/projects/${id}`,
      withAdminHeaders(adminKey, {
        method: "DELETE",
      }),
    ),
};
