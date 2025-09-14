import { climbNode } from "./utility.js";

export class Cart {
  #currentID = 0;
  #userCart = [];
  #productQuantity = 0;
  #productImage = [
    {
      id: 0,
      image: "./images/image-product-1.jpg",
    },
    {
      id: 1,
      image: "./images/image-product-2.jpg",
    },
    {
      id: 2,
      image: "./images/image-product-3.jpg",
    },
    {
      id: 3,
      image: "./images/image-product-4.jpg",
    },
  ];

  init() {
    this.windowResize();
    this.toggleCartDropdown();
    this.toggleMenu();

    this.initProductQuantity();
    this.initAddToCart();
    this.initPreviewImage();
    this.initPreviewThumbnails();
    this.initLightbox();
  }

  windowResize() {
    const mediaQuery = window.matchMedia("(max-width: 50em)");
    const navExpandFunction = this.navExpand;
    const dialog = document.querySelector("#preview-lightbox");

    function handleChange(e) {
      if (e.matches) {
        navExpandFunction(false, false);
        dialog.close();
      }
    }

    handleChange(mediaQuery); //run the code once upon init
    mediaQuery.addEventListener("change", handleChange);
  }

  openCartDropdown() {
    const cartHeaderBtn = document.getElementById("cart-button");
    const cartDropdown = document.getElementById("cart-dropdown");

    cartDropdown.style.display = "block";
    cartHeaderBtn.setAttribute("aria-expanded", true);
  }

  toggleCartDropdown() {
    const cartHeaderBtn = document.getElementById("cart-button");
    const cartDropdown = document.getElementById("cart-dropdown");
    const addCartBtn = document.getElementById("add-cart");

    const handleAnimation = () => {
      cartDropdown.style.display = "none";
    };

    addCartBtn.addEventListener("click", () => {
      this.openCartDropdown();
      cartDropdown.removeEventListener("animationend", handleAnimation);
    });

    cartHeaderBtn.addEventListener("click", () => {
      const isExpanded = cartHeaderBtn.getAttribute("aria-expanded");
      if (isExpanded === "false") {
        this.openCartDropdown();
        cartDropdown.removeEventListener("animationend", handleAnimation);
      } else {
        cartHeaderBtn.setAttribute("aria-expanded", false);
        cartDropdown.addEventListener("animationend", handleAnimation);
      }
    });
  }

  navExpand(isExpand, withAnimation = true) {
    const navOpenBtn = document.getElementById("nav-open");
    const navHeader = document.getElementsByClassName("page__header-nav")[0];

    if (isExpand || (!isExpand && !withAnimation)) {
      navOpenBtn.setAttribute("aria-expanded", isExpand);
    } else {
      navHeader.addEventListener(
        "animationend",
        () => {
          navOpenBtn.setAttribute("aria-expanded", isExpand);
        },
        { once: true }
      );
    }
  }

  toggleMenu() {
    const navOpenBtn = document.getElementById("nav-open");
    const navCloseBtn = document.getElementById("nav-close");
    const navOverlay = document.getElementById("nav-overlay");
    const navHeader = document.getElementsByClassName("page__header-nav")[0];

    navOpenBtn.addEventListener("click", () => {
      navHeader.classList.replace("close", "open");
      this.navExpand(true);
    });

    navCloseBtn.addEventListener("click", () => {
      navHeader.classList.replace("open", "close");
      this.navExpand(false);
    });

    navOverlay.addEventListener("click", (e) => {
      const targetID = e.target.getAttribute("id");
      if (targetID === "nav-overlay") {
        navHeader.classList.replace("open", "close");
        this.navExpand(false);
      }
    });
  }

  initProductQuantity() {
    const decreaseBtn = document.getElementById("productCartDecrease");
    const increaseBtn = document.getElementById("productCartIncrease");
    const quantityElem = document.getElementById("product-quantity");

    decreaseBtn.addEventListener("click", () => {
      if (this.#productQuantity > 0) {
        this.#productQuantity--;
        quantityElem.textContent = this.#productQuantity;
      }
    });

    increaseBtn.addEventListener("click", () => {
      this.#productQuantity++;
      quantityElem.textContent = this.#productQuantity;
    });
  }

  initAddToCart() {
    const addCartBtn = document.getElementById("add-cart");
    const productElem = document.querySelector(".product__content h1");
    const productThumbnailElem = document.querySelector(
      ".product__preview-thumbnails li:first-child img"
    );
    const quantityElem = document.getElementById("product-quantity");
    const priceElem = document.querySelector(".price__current-amount");

    addCartBtn.addEventListener("click", () => {
      if (this.#productQuantity > 0) {
        this.#userCart.push({
          id: this.#currentID,
          thumbnail: productThumbnailElem.getAttribute("src"),
          product: productElem.textContent,
          qty: quantityElem.textContent,
          price: priceElem.textContent,
        });
        quantityElem.textContent = "0";
        this.#productQuantity = 0;

        this.#currentID++;
        this.initCartItems();
      } else {
        alert("Quantity must be greater than 0.");
      }
    });
  }

  initCartItems() {
    const cartItemTemplate = document.getElementById("cart-item__template");
    const cartItemList = document.querySelector(".cart-item ul");

    const fragment = new DocumentFragment();

    for (let i = 0; i < this.#userCart.length; i++) {
      const { id, thumbnail, product, qty, price } = this.#userCart[i];
      const cartItemClone = cartItemTemplate.content.cloneNode(true);
      const cartItem = cartItemClone.querySelector("li");
      const cartItemImage = cartItemClone.querySelector("li > img");
      const cartItemProduct = cartItemClone.querySelector("h3");

      const cartItemPrice = cartItemClone.querySelector(".cart-item__price");
      let priceNumber = Number(price.trim().replace("$", ""));
      priceNumber = priceNumber ? priceNumber : 0;

      const cartItemQty = cartItemClone.querySelector(".cart-item__quantity");
      let qtyNumber = Number(qty.trim().replace("$", ""));
      qtyNumber = qtyNumber ? qtyNumber : 0;

      const cartItemTotal = cartItemClone.querySelector(".cart-item__total");
      const cartItemDelete = cartItemClone.querySelector(".cart-item__delete");

      cartItem.setAttribute("data-id", id);
      cartItem.setAttribute("aria-label", `Cart ${i + 1}.`);
      cartItemImage.setAttribute("src", thumbnail);
      cartItemProduct.textContent = product;
      cartItemPrice.textContent = price;
      cartItemQty.textContent = qty;
      cartItemTotal.textContent = `$${(priceNumber * qtyNumber).toFixed(2)}`;
      cartItemDelete.setAttribute("aria-label", `Delete cart ${i + 1}`);

      cartItemDelete.addEventListener("click", (e) => {
        const cartID = Number(e.currentTarget.parentElement.dataset["id"]);

        this.#userCart = this.#userCart.filter(({ id }) => !(id === cartID));
        this.initCartItems();
      });

      fragment.append(cartItemClone);
    }

    cartItemList.replaceChildren();
    cartItemList.appendChild(fragment);
  }

  initPreviewImage() {
    this.previewNext();
    this.previewPrevious();
  }

  previewNext() {
    const previewNextElement = document.querySelectorAll(
      ".product__preview-next"
    );

    for (let previewNext of previewNextElement) {
      const productImageButton = previewNext.parentElement.querySelector(
        ".product__preview-image"
      );
      const productImage =
        previewNext.parentElement.querySelector(".product-image");

      previewNext.addEventListener("click", (e) => {
        let imageNextID = Number(productImageButton.dataset["id"]) + 1;
        imageNextID = imageNextID < this.#productImage.length ? imageNextID : 0;

        this.selectedPreviewThumbnail(e, imageNextID);
        productImageButton.dataset["id"] = imageNextID;
        productImage.setAttribute("src", this.#productImage[imageNextID].image);
      });
    }
  }

  previewPrevious() {
    const productPreviousElements = document.querySelectorAll(
      ".product__preview-previous"
    );

    for (let previewPrevious of productPreviousElements) {
      const productImageButton = previewPrevious.parentElement.querySelector(
        ".product__preview-image"
      );
      const productImage =
        previewPrevious.parentElement.querySelector(".product-image");

      previewPrevious.addEventListener("click", (e) => {
        let imageNextID = Number(productImageButton.dataset["id"]) - 1;
        imageNextID =
          imageNextID >= 0 ? imageNextID : this.#productImage.length - 1;

        this.selectedPreviewThumbnail(e, imageNextID);
        productImageButton.dataset["id"] = imageNextID;
        productImage.setAttribute("src", this.#productImage[imageNextID].image);
      });
    }
  }

  getTopNode(htmlElement) {
    while (/^(SECTION|DIALOG)$/.test(htmlElement.tagName) === false) {
      htmlElement = htmlElement.parentElement;
    }

    return htmlElement;
  }

  selectedPreviewThumbnail(e, imageID) {
    let topNode = this.getTopNode(e.currentTarget || e);

    const thumbnailList = topNode.querySelector(".product__preview-thumbnails");
    const thumbnailListButtons = thumbnailList.querySelectorAll(
      ".product__preview-thumbnails button"
    );
    const currentThumbnail = thumbnailList.querySelector(
      `button[data-id="${imageID}"]`
    );

    this.resetAriaSelected(thumbnailListButtons);
    currentThumbnail.setAttribute("aria-selected", true);
  }

  resetAriaSelected(curentThumbnailList) {
    for (let thumbnail of curentThumbnailList) {
      thumbnail.setAttribute("aria-selected", false);
    }
  }

  initPreviewThumbnails() {
    const thumbnailElements = document.querySelectorAll(
      ".product__preview-thumbnails button"
    );

    const eventHandler = (e) => {
      const previewImage = this.getTopNode(e.currentTarget).querySelector(
        ".product__preview-image img"
      );
      const thumbnailListButtons = this.getTopNode(
        e.currentTarget
      ).querySelectorAll(".product__preview-thumbnails button");

      const imageID = e.currentTarget.dataset["id"];
      this.resetAriaSelected(thumbnailListButtons);

      previewImage.parentElement.dataset["id"] = imageID;
      e.currentTarget.setAttribute("aria-selected", true);
      previewImage.setAttribute("src", this.#productImage[imageID].image);
    };

    for (let thumbnail of thumbnailElements) {
      thumbnail.addEventListener("click", eventHandler);
    }
  }

  initLightbox() {
    const openLightboxElem = document.querySelector(".product__preview-image");
    const closeLightboxElem = document.getElementById("lightbox-close");

    openLightboxElem.addEventListener("click", this.showLightbox);
    closeLightboxElem.addEventListener("click", this.closeLightbox);
  }

  showLightbox = () => {
    const fontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );

    const windowWidth = window.innerWidth;
    const widthEM = windowWidth / fontSize;

    if (widthEM > 50) {
      const dialog = document.querySelector("#preview-lightbox");
      const productImageButton = dialog.querySelector(
        ".product__preview-image"
      );
      const productImage = dialog.querySelector(".product-image");

      productImageButton.dataset["id"] = 0;
      productImage.setAttribute("src", this.#productImage[0].image);
      this.selectedPreviewThumbnail(dialog, 0);
      dialog.showModal();
    }
  };

  closeLightbox() {
    const dialog = document.querySelector("#preview-lightbox");
    dialog.close();
  }
}
