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
          fetchAndDraw()
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
    getResultsDisplayed(name, "person-info-results");
  });

async function getResultsDisplayed(name, resultId) {
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

  // Get relationships by type
  const relationshipsByType = {};

  data.relationships.forEach((rel) => {
    if (relationshipsByType[rel.relationship]) {
      relationshipsByType[rel.relationship].push(rel);
    } else {
      relationshipsByType[rel.relationship] = [rel];
    }
  });

  // Draw relationships by type
  for (const [key, value] of Object.entries(relationshipsByType)) {
    infoHtml += `<h4>${key.replace("_", " ")}:</h4>`;
    for (const rel of value) {
      infoHtml += /*html*/ `<li><b>${rel.p2}</b></li>`;
    }
  }

  // data.relationships.forEach((rel) => {
  //   infoHtml += /*html*/ `<li>${rel.p1} <b>${rel.relationship.replace(
  //     "_",
  //     " "
  //   )}</b> ${rel.p2}</li>`;
  // });
  infoHtml += "</ul>";

  // Add new relationship for person
  // p1 is already defined as the person we are getting info for
  infoHtml += /*html*/ `<h3>Add new relationship:</h3>
                <form id="add-new-relationship-form"> 
                <select id="relationship-context" required>
                  <option value="" disabled selected>Select Relationship</option>
                  <option value="FRIENDS_WITH">Friends With</option>
                  <option value="DONT_LIKE">Don't Like</option>
                  <option value="GOT_WITH">Got With</option>
                  <option value="DATED">Dated</option>
                  <option value="DATING">Dating</option>
                </select>
                <input
                  list="p3-list"
                  type="text"
                  id="p3"
                  placeholder="Person 2"
                  required
                />
                <datalist id=p3-list></datalist>
                <button id=submit-relationship-menu>Add Relationship</button>
                </form>`;

  const results = document.getElementById(resultId);
  results.innerHTML = infoHtml;
  results.style.display = "block";
  fetchAndPopulateDatalist("p3", "p3-list");
  document
    .getElementById("submit-relationship-menu")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const relationship = document.getElementById(
        "relationship-context"
      ).value;
      const p2 = document.getElementById("p3").value;
      const p1 = name;
      const response = await addNewRelationship(p1, relationship, p2);
      if (response.status == 201) {
        fetchAndDraw();
        getResultsDisplayed(name, resultId);
      } else {
        alert(JSON.stringify(response));
      }
    });
}

async function addNewRelationship(p1, relationship, p2) {
  const dataJson = await fetch(`${apiUrl}/create_relationship`, {
    method: "POST",
    body: JSON.stringify({ p1, relationship, p2 }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());

  return dataJson;
}

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
