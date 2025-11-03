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

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "7b8e7883-cb19-4823-b295-16082b2a282a",
    "Content-Type": "application/json",
  },
});
import pencilLightUrl from "../images/pencil-light.svg";
import pencilUrl from "../images/pencil.svg";
import plusUrl from "../images/plus.svg";
import heartUrl from "../images/heart.svg";
import likedUrl from "../images/Like-icon-liked2.png";
import likedHoverUrl from "../images/Like-icon-liked-hover.svg";

document.addEventListener("DOMContentLoaded", () => {
  const logoImg = document.querySelector(".header__logo");
  if (logoImg) logoImg.src = logoUrl;

  const profileEditIcon = document.querySelector(".profile__edit-icon");
  if (profileEditIcon) profileEditIcon.src = pencilUrl;

  const profilePencilIcon = document.querySelector(".profile__pencil-icon");
  if (profilePencilIcon) profilePencilIcon.src = pencilLightUrl;

  const addIcon = document.querySelector(".profile__add-icon");
  if (addIcon) addIcon.src = plusUrl;
});

const preloadedCards = [
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
    name: "A very long bridge...",
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

function loadInitialData() {
  if (!cardsList || !cardTemplate) return;

  api
    .getAppInfo()
    .then(([user, cards]) => {
      try {
        console.debug("getAppInfo user:", user);
        console.debug("getAppInfo cards:", cards);
      } catch (err) {}

      if (user) {
        currentUserId = user._id;
        const avatarEl = document.querySelector(".profile__avatar");
        const nameEl = document.querySelector(".profile__name");
        const descEl = document.querySelector(".profile__description");
        console.log("[DEBUG] avatarEl:", avatarEl);
        console.log("[DEBUG] nameEl:", nameEl);
        console.log("[DEBUG] descEl:", descEl);
        if (avatarEl) {
          avatarEl.src = user.avatar || "";
          console.log("[DEBUG] Set avatar src to:", avatarEl.src);
        }
        if (nameEl) {
          nameEl.textContent = user.name || "";
          console.log("[DEBUG] Set name textContent to:", nameEl.textContent);
        }
        if (descEl) {
          descEl.textContent = user.about || "";
          console.log(
            "[DEBUG] Set description textContent to:",
            descEl.textContent
          );
        }
      } else {
        console.warn("[DEBUG] No user object returned from server");
      }

      const existingCards = Array.isArray(cards) ? cards : [];
      existingCards.forEach((item) => {
        const cardElement = getCardElement(item);
        cardsList.prepend(cardElement);
      });
    })
    .catch((err) => {
      console.error("Error loading initial app info:", err);
    });
}

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
const deleteModalCloseButton = deleteModal.querySelector(
  ".delete-modal__close-btn"
); // type="button"
const deleteCancelButton = deleteModal.querySelector(
  'button[type="button"]:not(.delete-modal__close-btn)'
);
if (deleteCancelButton) {
  deleteCancelButton.addEventListener("click", () => closeModal(deleteModal));
}

//New post modal
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#add-card-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImageLink = newPostModal.querySelector(
  "#add-card-image-link-input"
);
const newPostCaption = newPostModal.querySelector("#profile-caption-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;
let currentUserId = null;

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

  delBtn.addEventListener("click", () => {
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
  if (cardLikeBtn) {
    if (data.isLiked) {
      cardLikeBtn.classList.add("card__like-button_active");
      cardLikeBtn.style.backgroundImage = `url(${likedUrl})`;
    } else {
      cardLikeBtn.classList.remove("card__like-button_active");
      cardLikeBtn.style.backgroundImage = `url(${heartUrl})`;
    }
    cardLikeBtn.style.backgroundSize = "contain";
    cardLikeBtn.style.backgroundRepeat = "no-repeat";
  }

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  return cardElement;
}

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function cardDeleteHandler(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", closeModalEvents);
});

cardForm.addEventListener("submit", handleAddCardSubmit);

function openModal(modal) {
  try {
    console.debug(
      "openModal called for:",
      modal && modal.id ? modal.id : modal
    );
    console.trace();
  } catch (err) {}
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Saving...";
  submitBtn.disabled = true;

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      if (data) {
        if (profileName) profileName.textContent = data.name || "";
        if (profileDescription)
          profileDescription.textContent = data.about || "";
      }
      closeModal(editModal);
      disableButton(submitBtn, validationConfig);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
}

editFormElement.addEventListener("submit", handleEditFormSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Saving...";
  submitBtn.disabled = true;
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };

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
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
}

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
  const submitBtn = evt.submitter;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Saving...";
  submitBtn.disabled = true;
  api
    .updateUserAvatar({ avatar: avatarInput.value })
    .then((data) => {
      if (data && data.avatar) {
        const profileAvatar = document.querySelector(".profile__avatar");
        if (profileAvatar) {
          profileAvatar.alt = "User avatar";
          profileAvatar.src = data.avatar;
        }
      }
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
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
    if (event.target.classList.contains("modal")) {
      closeModal(event.target);
      return;
    }

    if (event.target.classList.contains("delete-modal__close-btn")) {
      const modal = event.target.closest(".modal");
      if (modal) closeModal(modal);
    }
  }
}

document.addEventListener("keydown", closeModalEvents);

// like status handler
function handleLike(evt, cardId) {
  const likeBtn = evt.target.closest(".card__like-btn");
  if (!likeBtn) return;

  const isLiked = likeBtn.classList.contains("card__like-button_active");
  api
    .likeStatus({ cardId, isLiked })
    .then((updatedCard) => {
      if (updatedCard.isLiked) {
        likeBtn.classList.add("card__like-button_active");
        likeBtn.style.backgroundImage = `url(${likedUrl})`;
      } else {
        likeBtn.classList.remove("card__like-button_active");
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
  const submitBtn = e.submitter;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Deleting...";
  submitBtn.disabled = true;
  if (selectedCardId) {
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
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    return;
  }

  if (selectedCard) selectedCard.remove();
  selectedCard = null;
  closeModal(deleteModal);
  submitBtn.textContent = originalText;
  submitBtn.disabled = false;
});

deleteModalCloseButton.addEventListener("click", () => closeModal(deleteModal));

enableValidation(validationConfig);

document.addEventListener("DOMContentLoaded", () => {
  const opened = Array.from(document.querySelectorAll(".modal_opened"));
  if (opened.length) {
    try {
      console.warn(
        "Found modal(s) opened on load, closing them:",
        opened.map((m) => m.id || m)
      );
    } catch (err) {}
  }
  opened.forEach((m) => m.classList.remove("modal_opened"));

  try {
    loadInitialData();
  } catch (err) {
    console.error("Failed to call loadInitialData:", err);
  }
});
