const apiUrl = "http://localhost:5000";

document
  .getElementById("create-person-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("person-name").value;
    await fetch(`${apiUrl}/create_person`, {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    alert("Person created");
  });

document
  .getElementById("create-relationship-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const p1 = document.getElementById("p1").value;
    const relationship = document.getElementById("relationship").value;
    const p2 = document.getElementById("p2").value;
    await fetch(`${apiUrl}/create_relationship`, {
      method: "POST",
      body: JSON.stringify({ p1, relationship, p2 }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((jsonData) => {
        const statusDiv = document.getElementById("relationship-status");
        if (jsonData.status == 201) {
          statusDiv.classList.remove("error");
          statusDiv.classList.add("success");
        } else {
          statusDiv.classList.remove("success");
          statusDiv.classList.add("error");
        }
        statusDiv.innerText = jsonData.message;
      });
  });

document
  .getElementById("get-person-info-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("info-name").value;
    const response = await fetch(`${apiUrl}/get_person_info?name=${name}`);
    const data = await response.json();

    let infoHtml = `<h2>${data.person.name}</h2>`;
    for (const [key, value] of Object.entries(data.person)) {
      if (key !== "name") {
        infoHtml += `<p>${
          key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
        }: <b>${value}</b></p>`;
      }
    }
    infoHtml += `<h3>Relationships:</h3>
                <ul>`;

    data.relationships.forEach((rel) => {
      infoHtml += `<li>${rel.p1} <b>${rel.relationship.replace("_", " ")}</b> ${
        rel.p2
      }</li>`;
    });
    infoHtml += "</ul>";

    const results = document.getElementById("person-info-results");
    results.innerHTML = infoHtml;
    results.style.display = "block";
  });

async function fetchAndPopulateDatalist(inputId, listId) {
  const input = document.getElementById(inputId);
  const dataList = document.getElementById(listId);

  input.addEventListener("input", async () => {
    const searchName = input.value;
    const response = await fetch(`${apiUrl}/search?name=${searchName}`);
    const data = await response.json();
    const persons = data.persons;

    // Clear previous options
    dataList.innerHTML = "";

    // Populate datalist with new options
    persons.forEach((person) => {
      const option = document.createElement("option");
      option.value = person;
      dataList.appendChild(option);
    });
  });
}

fetchAndPopulateDatalist("p1", "p1-list");
fetchAndPopulateDatalist("p2", "p2-list");
fetchAndPopulateDatalist("info-name", "info-name-list");
