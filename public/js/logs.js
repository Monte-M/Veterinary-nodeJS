const url = "http://localhost:3000";

const id = 6;

// html el
const logsEl = document.querySelector(".logs");
const presEl = document.querySelector(".pres");
const logsBtn = document.querySelector(".logs-btn");
const presBtn = document.querySelector(".pres-btn");

const getLogs = async () => {
  const id = localStorage.getItem("id");
  console.log(id);
  const resp = await fetch(`${url}/v1/logs/${id}`);
  const data = await resp.json();
  console.log("data", data);
  return data.result;
};

const getPres = async () => {
  const id = localStorage.getItem("id");
  console.log(id);
  const resp = await fetch(`${url}/v1/pres/${id}`);
  const data = await resp.json();
  console.log("data", data);
  return data.result;
};

const renderLogs = (arr, dest) => {
  const generatedLogs = arr.map(
    (logsItem) => `
    <div class="logs-container">
      <h3>${logsItem.description}</h3>
      <h4>Status: ${logsItem.status}</h4>
    </div>
    `
  );
  dest.innerHTML = generatedLogs.join("");
};

const renderPres = (arr, dest) => {
  const generatedPres = arr.map(
    (presItem) => `
        <div class="logs-container">
          <h3>Description</h3>
          <h4>${presItem.comment}</h4>
          <h4>${new Date(presItem.timestamp).toLocaleDateString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}</h4>
        </div>
    `
  );
  dest.innerHTML = generatedPres.join("");
};

const init = async () => {
  const logs = await getLogs();
  const pres = await getPres();
  renderLogs(logs, logsEl);
  renderPres(pres, presEl);
};

init();

presBtn.onclick = () => {
  if (presEl.style.display === "none") {
    presEl.style.display = "flex";
    presBtn.style.background = "rgb(255, 136, 0)";
  } else {
    presBtn.style.background = "red";
    presEl.style.display = "none";
  }
};

logsBtn.onclick = () => {
  if (logsEl.style.display === "none") {
    logsEl.style.display = "flex";
    logsBtn.style.background = "rgb(255, 136, 0)";
  } else {
    logsBtn.style.background = "red";
    logsEl.style.display = "none";
  }
};
