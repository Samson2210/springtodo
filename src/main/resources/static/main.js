const API_URL = "http://localhost:8080/api/todos";

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

// Fetch all todos from the backend
const fetchTodos = async () => {
  try {
    const response = await fetch(API_URL);
    const todos = await response.json();
    console.log(todos);
    renderTodos(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

// Render todos in the UI
const renderTodos = (todos) => {
  todoList.innerHTML = ""; // Clear existing todos
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = todo.task;
    if (todo.completed) li.classList.add("completed");

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.addEventListener("click", () => toggleComplete(todo.id));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
};

// Add a new todo
const addTodo = async (task) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task, completed: false }),
    });
    if (response.ok) {
      fetchTodos(); // Refresh todos
    } else {
      console.error("Error adding todo:", await response.text());
    }
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

// Toggle the completed status of a todo
const toggleComplete = async (id) => {
  try {
    const todo = await fetch(`${API_URL}/${id}`).then((res) => res.json());
    const updatedTodo = { ...todo, completed: !todo.completed };

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });
    if (response.ok) {
      fetchTodos(); // Refresh todos
    } else {
      console.error("Error updating todo:", await response.text());
    }
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

// Delete a todo
const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (response.ok) {
      fetchTodos(); // Refresh todos
    } else {
      console.error("Error deleting todo:", await response.text());
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

// Handle form submission
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = todoInput.value.trim();
  if (task) {
    addTodo(task);
    todoInput.value = ""; // Clear input field
  }
});

// Initial fetch of todos when the page loads
fetchTodos();
