const initialCards = [
  {
    name: "Bowling",
    link: "https://unsplash.com/photos/bowling-arena-IoBCIosXkH8",
  },
  {
    name: "Highway",
    link: "https://unsplash.com/photos/timelapse-photography-of-vehicles-at-night-GAVSpEx6ooc",
  },
  {
    name: "Concert",
    link: "https://unsplash.com/photos/crowd-at-music-festival-silhouette-making-noise-having-fun-Vg77z--e3KA",
  },
  {
    name: "Ballerinas",
    link: "https://unsplash.com/photos/man-and-woman-dancing-on-street-during-night-time-ETpTz0rSIdU",
  },
  {
    name: "Carnival",
    link: "https://unsplash.com/photos/ferris-wheel-during-night-MSgFReNI_PA",
  },
  {
    name: "Fire",
    link: "https://unsplash.com/photos/a-fire-is-lit-in-a-dark-room-VLHocpHATVo",
  },
];

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostProfileForm = newPostModal.querySelector(".modal__form");

const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostProfileSubmit(evt) {
  evt.preventDefault();
  const imageLink = newPostImageInput.value;
  console.log(imageLink);
  const newCaption = newPostCaptionInput.value;
  closeModal(newPostModal);
  console.log(newCaption);
}

newPostProfileForm.addEventListener("submit", handleNewPostProfileSubmit);

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

initialCards.forEach(function (item) {
  console.log(item.name);
  console.log(item.link);
});
