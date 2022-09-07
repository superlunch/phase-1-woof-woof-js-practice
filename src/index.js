document.addEventListener("DOMContentLoaded", start);

function start(e) {
  const filterDogsButton = document.querySelector("#good-dog-filter");
  filterDogsButton.addEventListener("click", toggleFilterDogs);
  grabAllDogs().then(allDogsToDogBar);
}

// What is with the filter/good dog/update stuff

function toggleFilterDogs(e) {
  const filterDogsButton = document.querySelector("#good-dog-filter");
  if (filterDogsButton.innerText.includes("OFF")) {
    filterDogsButton.innerText = "Filter good dogs: ON";
    updateDogBar();
  } else {
    filterDogsButton.innerText = "Filter good dogs: OFF";
    updateDogBar();
  }
}

function allDogsToDogBar(dogArray, filter = false) {
  const dogBar = document.getElementById("dog-bar");
  dogBar.innerHTML = "";
  if (filter) {
    dogArray.filter((dog) => dog.isGoodDog).forEach(addSpanToDogBar);
  } else {
    dogArray.forEach(addSpanToDogBar);
  }
}

function addSpanToDogBar(dog) {
  const dogBar = document.getElementById("dog-bar");
  const span = document.createElement("span");
  span.innerText = dog.name;
  span.dataset.id = dog.id;

  span.addEventListener("click", spanClickEvent);

  dogBar.append(span);
}

function spanClickEvent(e) {
  grabDog(e.target.dataset.id).then(displayDogInfo);
}

function displayDogInfo(dog) {
  const dogInfo = document.getElementById("dog-info");
  dogInfo.innerHTML = "";

  const dogImage = document.createElement("img");
  dogImage.src = dog.image;

  const dogName = document.createElement("h2");
  dogName.innerText = dog.name;

  const dogButton = document.createElement("button");
  dogButton.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
  dogButton.dataset.id = dog.id;
  dogButton.addEventListener("click", buttonClickEvent);

  dogInfo.append(dogImage, dogName, dogButton);
}

function buttonClickEvent(e) {
  let newValue;
  if (e.target.innerText.includes("Good")) {
    e.target.innerText = "Bad Dog";
    newValue = false;
  } else {
    e.target.innerText = "Good Dog";
    newValue = true;
  }
  toggleGoodDog(e.target.dataset.id, newValue).then(updateDogBar);
}

function updateDogBar() {
  const filterDogsButton = document.getElementById("good-dog-filter");
  if (filterDogsButton.innerText.includes("OFF")) {
    grabAllDogs().then((dogArray) => allDogsToDogBar(dogArray));
  } else {
    grabAllDogs().then((dogArray) => allDogsToDogBar(dogArray, true));
  }
}

// etc.

const dataUrl = "http://localhost:3000/pups";

function grabAllDogs() {
  return fetch(dataUrl).then((res) => res.json());
}

function grabDog(id) {
  return fetch(dataUrl + `/${id}`).then((res) => res.json());
}

function toggleGoodDog(id, newValue) {
  const assess = {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      isGoodDog: newValue,
    }),
  };
  return fetch(dataUrl + `/${id}`, assess).then((res) => res.json());
}
