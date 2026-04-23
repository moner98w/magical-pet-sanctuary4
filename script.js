const API_URL = "https://69ea537015c7e2d51269b0d3.mockapi.io/pets";

const petsContainer = document.getElementById("petsContainer");
const petForm = document.getElementById("petForm");
const formContainer = document.getElementById("formContainer");
const showFormBtn = document.getElementById("showFormBtn");

showFormBtn.addEventListener("click", () => {
  formContainer.classList.toggle("hidden");
});

function createPetCard(pet) {
  const card = document.createElement("div");
  card.className = "pet-card";
  card.setAttribute("data-id", pet.id);

  card.innerHTML = `
    <h3>${pet.name}</h3>
    <p><strong>Type:</strong> ${pet.type}</p>
    <p><strong>Color:</strong> ${pet.color}</p>
    <p><strong>Description:</strong> ${pet.description}</p>
    <button class="delete-btn">Release</button>
  `;

  const deleteBtn = card.querySelector(".delete-btn");

  deleteBtn.addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to release this pet?");
    if (!confirmDelete) {
      return;
    }

    try {
      await fetch(`${API_URL}/${pet.id}`, {
        method: "DELETE"
      });

      card.remove();
    } catch (error) {
      console.log("Delete error:", error);
    }
  });

  petsContainer.appendChild(card);
}

async function getPets() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    petsContainer.innerHTML = "";

    data.forEach((pet) => {
      createPetCard(pet);
    });
  } catch (error) {
    console.log("Get error:", error);
  }
}

petForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPet = {
    name: document.getElementById("name").value,
    type: document.getElementById("type").value,
    color: document.getElementById("color").value,
    description: document.getElementById("description").value
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPet)
    });

    const addedPet = await response.json();

    createPetCard(addedPet);
    petForm.reset();
    formContainer.classList.add("hidden");
  } catch (error) {
    console.log("Post error:", error);
  }
});

getPets();
