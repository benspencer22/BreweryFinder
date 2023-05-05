const searchForm = document.getElementById("top-search");
searchForm.onsubmit = (ev) => {
  console.log("submitted top-search with", ev);
  ev.preventDefault();
  // https://stackoverflow.com/a/26892365/1449799
  const formData = new FormData(ev.target);
  // console.log(formData)
  // for (const pair of formData.entries()) {
  //   console.log(`${pair[0]}, ${pair[1]}`);
  // }
  const queryText = formData.get("query");
  console.log("queryText", queryText);

  const breweryResultsPromise = getBrewery(queryText);
  breweryResultsPromise.then((breweryResults) => {
    const breweryListItemsArray = breweryResults.map(rhymObj2DOMObj);
    console.log("breweryListItemsArray", breweryListItemsArray);
    const breweryResultsUL = document.getElementById("brewery-results");
    breweryListItemsArray.forEach((breweryLi) => {
      breweryResultsUL.appendChild(breweryLi);
    });
  });
};

const getBrewery = (word) => {
  console.log("attempting to get rhymes for", word);
  return fetch(
    `https://api.openbrewerydb.org/v1/breweries?by_state=${word}&per_page=10000`
  ).then((resp) => resp.json());
};

const rhymObj2DOMObj = (breweryObj) => {
  const breweryListItem = document.createElement("li");
  const breweryButton = document.createElement("button");
  breweryButton.classList.add('btn')
  breweryButton.classList.add('btn-info')
  breweryButton.value = breweryObj.postal_code.slice(0, breweryObj.postal_code.length - 5);
  breweryButton.textContent = breweryObj.name;
  breweryButton.onclick = searchForBook;
  breweryListItem.appendChild(breweryButton);
  return breweryListItem;
};
// Create a swap button for sorting.
const swapButton = document.createElement("button");
swapButton.textContent = "Sort Opposite Alphabetical";
swapButton.addEventListener("click", swapButtonOrder);
// Add it to the nav at top of page.
const navBar = document.querySelector("nav");
navBar.appendChild(swapButton);

// if any of the results are clicked we will then create the info box for it.
const searchForBook = (ev) => {

  const word = ev.target.value;
  console.log("search for", word);
  return fetch(`http://ZiptasticAPI.com/${word}`).then((r) =>
    r.json()
  ).then((zipResultsObj)=> {
    console.log(zipResultsObj)
    createInfoBox(zipResultsObj)
  })
};
// Creates a box at the top of screen
function createInfoBox(obj) {
  // If the attribute exists, we will just edit the old box. If not we create a new box with the correct style.
  let box = document.getElementById("infoBox");
  if (!box) {
    box = document.createElement("div");
    box.setAttribute("id", "infoBox");
    box.style.border = "2px solid green";
    box.style.borderRadius = "10px";
    box.style.padding = "10px";
    // box.style.position = "relative"; 
    // box.style.width = "100%";
    document.body.appendChild(box); 
  }
  // Edit box, if already full will reset text inside and re-add the country/state/city.

  const country = document.createElement("p");
  country.textContent = `Country: ${obj.country}`;
  const state = document.createElement("p");
  state.textContent = `State: ${obj.state}`;
  const city = document.createElement("p");
  city.textContent = `City: ${obj.city}`;
  const header = document.createElement("h5")
  header.style.textDecoration = 'underline'
  header.textContent = 'Brewery Information:'
  box.innerHTML = '';
  box.appendChild(header);
  box.appendChild(country);
  box.appendChild(state);
  box.appendChild(city);
}

function swapButtonOrder() {
  // Get the Buttons on page in the list.
  const buttonList = document.querySelector("body ul");
  const buttons = buttonList.querySelectorAll("li");
  // Turn into array so we can reverse order using reverse method.
  const buttonArray = Array.from(buttons);
  buttonArray.reverse();
  // Make the old array 
  buttonList.innerHTML = "";
  buttonArray.forEach((button) => {
    buttonList.appendChild(button);
  });
}












































