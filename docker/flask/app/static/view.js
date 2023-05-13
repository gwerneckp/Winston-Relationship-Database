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
        infoHtml += /*html*/ `<li>
                                <b style='flex: 2'>${rel.p2}</b>
                                </li>`;
      }
    }
  }

  infoHtml += "</ul>";

  const results = document.getElementById(resultId);
  results.innerHTML = infoHtml;
  results.style.display = "block";
  fetchAndPopulateDatalist("p3", "p3-list");
}

document.getElementById("submit-suggestion").onclick = async () => {
  const message = document.getElementById("suggestion").value;

  const response = await fetch(`/suggest`, {
    credentials: "same-origin",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCookie("csrf_access_token"),
    },
    body: JSON.stringify({ message }),
  });

  const suggestionStatus = document.getElementById("suggestion-status");
  if (response.status === 200) {
    document.getElementById("suggestion").value = "";
    suggestionStatus.innerHTML = "Suggestion submitted!";
    suggestionStatus.style.backgroundColor = "#94d6a4";
  } else {
    suggestionStatus.innerHTML = "Error submitting suggestion";
    suggestionStatus.style.backgroundColor = "#d69494";
  }
};
