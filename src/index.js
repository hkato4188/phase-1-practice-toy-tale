let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      newToyForm.addEventListener("submit", (event) => {
        event.preventDefault();
      });
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const newToyForm = document.getElementById("new-toy-form");
  const toysUrl = "http://localhost:3000/toys";
  const toyCollectionDiv = document.getElementById("toy-collection");
  const inputToyName = document.getElementById("inputToyName");
  const inputToyUrl = document.getElementById("inputToyUrl");

  //fetch and create toy collection
  fetch(toysUrl)
    .then((res) => res.json())
    .then((toyCollection) => {
      for (let toy in toyCollection) {
        createToy(toyCollection[toy]);
      }

      //add a new toy

      newToyForm.addEventListener("submit", (e) => {
        e.preventDefault();

        fetch(toysUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: inputToyName.value,
            image: inputToyUrl.value,
            likes: 0,
          }),
        })
          .then((res) => res.json())
          .then((toy) => {
            let newToy = createToy(toy);
            toyCollectionDiv.append(newToy);
          });
      });

      //patch to increase toy likes
      function addLikes(event) {
        event.preventDefault();
        let pLikeTag = event.target.previousElementSibling;
        let newNumberOfLikes = parseInt(pLikeTag.innerText) + 1;
        //The ID on each button corresponds with the toy ID
        let patchUrl = `${toysUrl}/${event.target.id}`;
        fetch(patchUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            likes: newNumberOfLikes,
          }),
        })
          .then((res) => res.json())
          .then((likeValue) => {
            pLikeTag.innerText = `${newNumberOfLikes}`;
          });
      }

      //functions
      function createToy(toy) {
        let toyCard = document.createElement("div");
        toyCard.setAttribute("class", "card");
        let toyNameElement = document.createElement("h2");
        toyNameElement.innerText = toy.name;
        let toyImgElement = document.createElement("img");
        toyImgElement.src = toy.image;
        toyImgElement.setAttribute("class", "toy-avatar");
        let toyLikesElement = document.createElement("p");
        toyLikesElement.innerText = toy.likes;
        let toyLikeButtonElement = document.createElement("button");
        toyLikeButtonElement.setAttribute("class", "like-btn");
        toyLikeButtonElement.setAttribute("id", `${toy.id}`);
        toyLikeButtonElement.innerText = "Like";
        toyLikeButtonElement.addEventListener("click", (e) => {
          addLikes(e);
        });
        toyCard.append(
          toyNameElement,
          toyImgElement,
          toyLikesElement,
          toyLikeButtonElement
        );
        toyCollectionDiv.append(toyCard);
      }
    });
});
