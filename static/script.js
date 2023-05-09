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
  .getElementById("search-person-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("search-name").value;
    const response = await fetch(`${apiUrl}/search?name=${name}`);
    const data = await response.json();
    const persons = data.persons;
    document.getElementById("search-results").innerText = persons.join(", ");
  });

document
  .getElementById("get-person-info-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("info-name").value;
    const response = await fetch(`${apiUrl}/get_person_info?name=${name}`);
    const data = await response.json();
    console.log(data);
    let infoHtml = "";
    Object.entries(data.person).forEach(([key, value]) => {
      infoHtml += `<p>${key}: ${value}</p>`;
    });
    data.relationships.forEach((record) => {
      infoHtml += `<p>${record.p1} - ${record.relationship} - ${record.p2}</p>`;
    });
    document.getElementById("person-info-results").innerHTML = infoHtml;
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
