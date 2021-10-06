const url = "http://localhost:3000";

const id = 6;

// html el
const logsEl = document.querySelector(".logs");

const getLogs = async () => {
  const resp = await fetch(`${url}/v1/logs/5`);
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
    logs[i].onclick = () => {
      window.location.href = "medications.html";
    };
    del[i].onclick = deletePets;
  }
};

const init = async () => {
  const logs = await getLogs();
};

init();
