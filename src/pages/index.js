import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
} from "../scripts/validate.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers";
import logoUrl from "../images/Logo.svg";
import bessieAvatarUrl from "../images/2-photo-by-ceiline-from-pexels.jpg";
import localAvatar from "../images/avatar.jpg";
import pencilLightUrl from "../images/pencil-light.svg";
import pencilUrl from "../images/pencil.svg";
import plusUrl from "../images/plus.svg";
import heartUrl from "../images/heart.svg";
import likedUrl from "../images/Like-icon-liked2.png";
import likedHoverUrl from "../images/Like-icon-liked-hover.svg";

document.addEventListener("DOMContentLoaded", () => {
  const logoImg = document.querySelector(".header__logo");
  if (logoImg) logoImg.src = logoUrl;

  const avatarImg = document.querySelector(".profile__avatar");
  if (avatarImg) avatarImg.src = localAvatar;

  const profileEditIcon = document.querySelector(".profile__edit-icon");
  if (profileEditIcon) profileEditIcon.src = pencilUrl;

  const profilePencilIcon = document.querySelector(".profile__pencil-icon");
  if (profilePencilIcon) profilePencilIcon.src = pencilLightUrl;

  const addIcon = document.querySelector(".profile__add-icon");
  if (addIcon) addIcon.src = plusUrl;
});

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "39f62b95-67ac-4d7c-bf5a-ef1eec819efb",
    "Content-Type": "application/json",
  },
});

// Destructure the second item in the callback of the .then()
api.getAppInfo().then(([cards]) => {
  cards.forEach((item) => {
    const cardElement = getCardElement(item);
    cardsList.prepend(cardElement);
  });

  // Handle the user's information
  // set the src of the avatar image
  // set the textContent of both the text elements
});

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Form elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editProfileCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardForm.querySelector("#profile-caption-input");
const cardLinkInput = cardForm.querySelector("#add-card-image-link-input");

// Avatar form element
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__button");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteModalCloseButton = deleteModal.querySelector(".modal__close-btn"); // type="button"

//new post modal
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#add-card-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector("#new-post-form");
const newPostImageLink = newPostModal.querySelector("#image-link-input");
const newPostCaption = newPostModal.querySelector("#caption-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

// Card related elements
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const templateEl = document.querySelector("#card-template");
if (!templateEl) {
  throw new Error("Missing #card-template in index.html");
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const img = cardElement.querySelector(".card__image");
  const title = cardElement.querySelector(".card__title");
  const delBtn = cardElement.querySelector(".card__delete-btn");

  img.src = data.link;
  img.alt = data.name;
  title.textContent = data.name;

  // open delete confirm instead of removing immediately
  delBtn.addEventListener("click", () => {
    // store reference to the card element and its id so we can delete after server success
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  img.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImgEl.src = data.link;
    previewModalImgEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  // ensure the background image is set using the bundler-resolved URL
  if (cardLikeBtn) {
    cardLikeBtn.style.backgroundImage = `url(${heartUrl})`;
    cardLikeBtn.style.backgroundSize = "contain";
    cardLikeBtn.style.backgroundRepeat = "no-repeat";
  }

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  return cardElement;
}

initialCards.forEach((data) => cardsList.prepend(getCardElement(data)));

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function cardDeleteHandler(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

const modals = document.querySelectorAll(".modal");

cardForm.addEventListener("submit", handleAddCardSubmit);

function openModal(modal) {
  // debug: log when modals are opened to help trace unexpected opens
  try {
    // eslint-disable-next-line no-console
    console.debug(
      "openModal called for:",
      modal && modal.id ? modal.id : modal
    );
    // eslint-disable-next-line no-console
    console.trace();
  } catch (err) {
    // swallow logging errors in older browsers
  }
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  // Change text content to "Saving..."
  const submitBtn = evt.submitter;
  // submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      // TODO - Use data argument instead of the input values
      profileName.textContent = editModalNameInput.value;
      profileDescription.textContent = editModalDescriptionInput.value;
      closeModal(editModal);
      disableButton(evt.submitter, validationConfig);
    })
    .catch(console.error)
    .finally(() => {
      // TODO - call setButtonText instead
      submitBtn.textContent = "Save";
    });
}

// TODO - implement loading text for all other form submissions

editFormElement.addEventListener("submit", handleEditFormSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .createCard(inputValues)
    .then((createdCard) => {
      const cardElement = getCardElement(createdCard);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      evt.target.reset();
      disableButton(submitBtn, validationConfig);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

// deletion is handled on the modal submit below

// Avatar modal open & close handlers
avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
  resetValidation(avatarModalForm, [avatarInput], validationConfig);
});

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

//submit handler for avatar modal
avatarModalForm.addEventListener("submit", avatarHandlerSubmit);

function avatarHandlerSubmit(evt) {
  evt.preventDefault();
  api
    .updateUserAvatar({ avatar: avatarInput.value })
    .then((data) => {
      // Use data for updating the avatar
      const profileAvatar = document.querySelector(".profile__avatar");
      profileAvatar.alt = "User avatar";
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
  openModal(editModal);
});

// close the edit modal
editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
  resetValidation(
    newPostForm,
    [newPostImageLink, newPostCaption],
    validationConfig
  );
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function closeModalEvents(event) {
  const openedModal = document.querySelector(".modal_opened");

  if (event.type === "keydown" && event.key === "Escape" && openedModal) {
    closeModal(openedModal);
  }

  if (event.type === "mousedown") {
    // backdrop click
    if (event.target.classList.contains("modal")) {
      closeModal(event.target);
      return;
    }

    // close button click - find parent modal
    if (event.target.classList.contains("modal__close-btn")) {
      const modal = event.target.closest(".modal");
      if (modal) closeModal(modal);
    }
  }
}

document.addEventListener("keydown", closeModalEvents);

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", closeModalEvents);
});

// like status handler
function handleLike(evt, cardId) {
  // find the button element (in case an inner element was clicked)
  const likeBtn = evt.target.closest(".card__like-btn");
  if (!likeBtn) return;

  const isLiked = likeBtn.classList.contains("card__like-button_active");
  api
    .likeStatus({ cardId, isLiked })
    .then(() => {
      // toggle the class used by CSS
      likeBtn.classList.toggle("card__like-button_active");

      // update inline background image to ensure bundler-resolved assets are used
      if (likeBtn.classList.contains("card__like-button_active")) {
        likeBtn.style.backgroundImage = `url(${likedUrl})`;
      } else {
        likeBtn.style.backgroundImage = `url(${heartUrl})`;
      }
    })
    .catch(console.error);
}

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // if we have a server id for this card, call the API first
  const submitBtn = e.submitter;
  if (selectedCardId) {
    if (submitBtn) submitBtn.disabled = true;
    api
      .deleteCard(selectedCardId)
      .then(() => {
        if (selectedCard) selectedCard.remove();
        selectedCard = null;
        selectedCardId = null;
        closeModal(deleteModal);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
    return;
  }

  // fallback for local-only cards without an id
  if (selectedCard) selectedCard.remove();
  selectedCard = null;
  closeModal(deleteModal);
});

deleteModalCloseButton.addEventListener("click", () => closeModal(deleteModal));

// backdrop/X close (match your markup)
// single centralized modal close handling is wired above:
// - Escape key: document-level keydown listener
// - Backdrop & close-button: individual modal mousedown listeners
// add mousedown listeners to each modal to handle backdrop & close-button clicks
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", closeModalEvents);
});

enableValidation(validationConfig);

// Defensive: ensure no modal is left open on initial load (helps catch markup or legacy script issues)
document.addEventListener("DOMContentLoaded", () => {
  const opened = Array.from(document.querySelectorAll(".modal_opened"));
  if (opened.length) {
    try {
      // eslint-disable-next-line no-console
      console.warn(
        "Found modal(s) opened on load, closing them:",
        opened.map((m) => m.id || m)
      );
    } catch (err) {}
  }
  opened.forEach((m) => m.classList.remove("modal_opened"));
});
