function getCookie(name) {
  var start = document.cookie.indexOf(name + "=");
  var len = start + name.length + 1;
  if (!start && name != document.cookie.substring(0, name.length)) {
    return null;
  }
  if (start == -1) return null;
  var end = document.cookie.indexOf(";", len);
  if (end == -1) end = document.cookie.length;
  return unescape(document.cookie.substring(len, end));
}

document
  .getElementById("create-person-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("person-name").value;
    await fetch("/create_person", {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCookie("csrf_access_token"),
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
    await fetch("/create_relationship", {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify({ p1, relationship, p2 }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCookie("csrf_access_token"),
      },
    })
      .then((data) => data.json())
      .then((jsonData) => {
        const statusDiv = document.getElementById("relationship-status");
        if (jsonData.status == 201) {
          statusDiv.classList.remove("error");
          statusDiv.classList.add("success");
          fetchAndDraw();
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
  const response = await fetch(`/get_person_info?name=${name}`, {
    credentials: "same-origin",
    headers: {
      "X-CSRF-TOKEN": getCookie("csrf_access_token"),
    },
  });
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

  // This was added to only show relatiohsips of type: GOT_WITH, DATED, DATING
  const acceptedTypes = ["DATING", "GOT_WITH", "DATED"];
  for (let i in acceptedTypes) {
    if (relationshipsByType[acceptedTypes[i]]) {
      infoHtml += `<h4>${acceptedTypes[i].replace("_", " ")}:</h4>`;
      for (const rel of relationshipsByType[acceptedTypes[i]]) {
        infoHtml += /*html*/ `<li><div class="flex">
                              <b style='flex: 2'>${rel.p2}</b>
                              <button class='delete-button' data-p1="${rel.p1}" data-p2="${rel.p2}" data-relationship="${rel.relationship}" id="delete-relationship">Delete</button>
                              </div></li>`;
      }
    }
  }

  // Show all relationships (including ones that are not GOT_WITH, DATED, DATING)
  // for (const [key, value] of Object.entries(relationshipsByType)) {
  //   infoHtml += `<h4>${key.replace("_", " ")}:</h4>`;
  //   for (const rel of value) {
  //     infoHtml += /*html*/ `<li><b>${rel.p2}</b></li>`;
  //   }
  // }

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
                  <option value="" disabled>Select Relationship</option>
                  <option value="GOT_WITH" selected>Got With</option>
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

  const deleteButton = document.getElementById("delete-relationship");
  if (deleteButton) {
    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const p1 = e.target.dataset.p1;
      const relationship = e.target.dataset.relationship;
      const p2 = e.target.dataset.p2;

      if (await deleteRelationship(p1, relationship, p2)) {
        fetchAndDraw();
        getResultsDisplayed(name, resultId);
      } else {
        alert(JSON.stringify(response));
      }
    });
  }

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

async function deleteRelationship(p1, relationship, p2) {
  const dataJson = await fetch("/delete_relationship", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify({ p1, relationship, p2 }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCookie("csrf_access_token"),
    },
  }).then((data) => data.json());

  return dataJson;
}

async function addNewRelationship(p1, relationship, p2) {
  const dataJson = await fetch("/create_relationship", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify({ p1, relationship, p2 }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCookie("csrf_access_token"),
    },
  }).then((data) => data.json());

  return dataJson;
}

async function fetchAndPopulateDatalist(inputId, listId) {
  const input = document.getElementById(inputId);
  const dataList = document.getElementById(listId);

  input.addEventListener("input", async () => {
    const searchName = input.value;
    const response = await fetch(`/search?name=${searchName}`, {
      headers: {
        "X-CSRF-TOKEN": getCookie("csrf_access_token"),
      },
      credentials: "same-origin",
    });
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
