const STORAGE_KEY = "simple_habit_tracker_v1";
const MAX_HABITS = 15;

const form = document.getElementById("habit-form");
const input = document.getElementById("habit-input");
const list = document.getElementById("habit-list");
const count = document.getElementById("count");

let habits = loadHabits();
render();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name || habits.length >= MAX_HABITS) return;

  habits.push({
    id: crypto.randomUUID(),
    name,
    done: false,
  });
  input.value = "";
  saveAndRender();
});

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((h) => h && typeof h.name === "string")
      .slice(0, MAX_HABITS)
      .map((h) => ({
        id: typeof h.id === "string" ? h.id : crypto.randomUUID(),
        name: h.name.trim(),
        done: Boolean(h.done),
      }))
      .filter((h) => h.name.length > 0);
  } catch {
    return [];
  }
}

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function saveAndRender() {
  saveHabits();
  render();
}

function render() {
  count.textContent = `${habits.length}/${MAX_HABITS} habits`;
  input.disabled = habits.length >= MAX_HABITS;
  form.querySelector("button").disabled = habits.length >= MAX_HABITS;
  input.placeholder =
    habits.length >= MAX_HABITS ? "Limit reached (15)" : "Add a habit";

  list.innerHTML = "";

  habits.forEach((habit) => {
    const item = document.createElement("li");
    item.className = "habit-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.done;
    checkbox.setAttribute("aria-label", `Mark ${habit.name} complete`);
    checkbox.addEventListener("change", () => {
      habit.done = checkbox.checked;
      saveHabits();
    });

    const name = document.createElement("span");
    name.className = "habit-name";
    name.textContent = habit.name;

    const remove = document.createElement("button");
    remove.className = "remove";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      habits = habits.filter((h) => h.id !== habit.id);
      saveAndRender();
    });

    item.append(checkbox, name, remove);
    list.appendChild(item);
  });
}
