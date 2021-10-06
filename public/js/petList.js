const url = "http://localhost:3000";

// html el
const petsEl = document.querySelector(".pets");
const addPet = document.querySelector(".add-pet");

const getPets = async () => {
  const resp = await fetch(`${url}/v1/pets`);
  const data = await resp.json();
  console.log("data", data);
  return data.result;
};

const renderPets = (arr, dest) => {
  const generatedPets = arr.map(
    (petsItem) => `
        <div class="pet-container" id="${petsItem.id}">
            <h3>${petsItem.name}</h3>
            <h4>${petsItem.dob}</h4>
            <h4>${petsItem.client_email}</h4>
            <div class="buttons">
            <button class="logs">VIEW LOG</button>
            <button class="delete">DELETE</button>
            </div>
        </div>
    `
  );
  dest.innerHTML = generatedPets.join("");

  const logs = document.querySelectorAll(".logs");
  const del = document.querySelectorAll(".delete");
  for (let i = 0; i < logs.length; i++) {
    // logs[i].onclick = setItem;
    del[i].onclick = deletePets;
  }
};

addPet.onclick = () => {
  console.log("hi");
  localStorage.setItem = ("test", Date.now());
};

// const setItem = async (e) => {
//   const id = e.path[2].id;
//   console.log(id);
//   sessionStorage.setItem = ("test", Date.now());
//   // window.location.href = "logs.html";
// };

const deletePets = async (e) => {
  const id = e.path[2].id;
  console.log(id);
  const resp = await fetch(`${url}/v1/pets/${id}`, {
    method: "DELETE",
  });

  const data = await resp.json();
  console.log("data", data);
  return data.result;
};

const init = async () => {
  const pets = await getPets();
  renderPets(pets, petsEl);
};

init();
