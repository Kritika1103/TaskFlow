const API_URL = "http://localhost:5000/api";

function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
    .then((res) => res.json())
    .then((data) => alert(data.message))
    .catch((err) => console.log(err));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        showTasks();
      } else {
        alert(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function showTasks() {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("task-section").classList.remove("hidden");
  document.getElementById("welcome").innerText =
    "Welcome, " + localStorage.getItem("name");
  fetchTasks();
}

function addTask() {
  const title = document.getElementById("taskInput").value;

  fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ title }),
  })
    .then((res) => res.json())
    .then(() => {
      document.getElementById("taskInput").value = "";
      fetchTasks();
    });
}

function fetchTasks() {
  fetch(`${API_URL}/tasks`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((tasks) => {
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = "";

      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span style="text-decoration:${task.completed ? "line-through" : "none"}">${task.title}</span>
          <div>
            <button onclick="toggleTask('${task._id}', ${task.completed})">✔</button>
            <button onclick="deleteTask('${task._id}')">🗑</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    });
}

function toggleTask(id, completed) {
  fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ completed: !completed }),
  }).then(() => fetchTasks());
}

function deleteTask(id) {
  fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }).then(() => fetchTasks());
}

function logout() {
  localStorage.clear();
  location.reload();
}

if (localStorage.getItem("token")) {
  showTasks();
}
