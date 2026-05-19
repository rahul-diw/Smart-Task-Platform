const API_URL = "http://localhost:5000/api";


// ================= LOGIN =================
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  // ✅ save tokens
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  return data;
};


// ================= REFRESH TOKEN =================
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json();

  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }

  return data.accessToken;
};


// ================= SMART FETCH =================
const authFetch = async (url, options = {}) => {
  let token = localStorage.getItem("accessToken");

  console.log("TOKEN SENT:", token);

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // 🔥 token expired
  if (res.status === 401) {
    console.log("Token expired... refreshing");

    const newToken = await refreshAccessToken();

    if (!newToken) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    // 🔁 retry request
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  return res;
};


// ================= WORKSPACES =================
export const getWorkspaces = async () => {
  const res = await authFetch(`${API_URL}/workspaces`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};


// ================= PROJECTS =================
export const getProjects = async (workspaceId) => {
  const res = await authFetch(`${API_URL}/projects/${workspaceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

export const createProject = async (data) => {
  const res = await authFetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteProject = async (projectId) => {
  const res = await authFetch(`${API_URL}/projects/${projectId}`, {
    method: "DELETE",
  });

  return res.json();
};

export const updateProject = async (projectId, name) => {
  const res = await authFetch(`${API_URL}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return res.json();
};


// ================= TASKS =================
export const getTasks = async (projectId) => {
  const res = await authFetch(`${API_URL}/tasks/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

export const createTask = async (taskData) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: taskData,
  });

  return res.json();
};

export const deleteTask = async (taskId) => {
  const res = await authFetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });

  return res.json();
};

export const updateTask = async (taskId, data) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateTaskStatus = async (taskId, status) => {
  const res = await authFetch(`${API_URL}/tasks/${taskId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return res.json();
};


// ================= DASHBOARD =================
export const getDashboardStats = async () => {
  const res = await authFetch(`${API_URL}/dashboard`);

  return res.json();
};


export const getUsers = async () => {
  const res = await authFetch(`${API_URL}/users`);
  return res.json();
};

export const addComment = async (text, taskId) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch("http://localhost:5000/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, taskId }),
  });

  return res.json();
};

export const getComments = async (taskId) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `http://localhost:5000/api/comments/${taskId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.json();
};

export const getActivities = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch("http://localhost:5000/api/activity", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const getMe = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    "http://localhost:5000/api/users/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
};

