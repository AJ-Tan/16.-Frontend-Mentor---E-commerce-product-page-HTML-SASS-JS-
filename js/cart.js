export class Cart {
  #currentID = 0;
  #currentThumbnailID = 0;
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
  #cartDOM = {
    /*Window*/
    mediaTablet: window.matchMedia("(max-width: 50em)"),

    /*Header*/
    /** Navigation **/
    nav: document.querySelector(".page__header-nav"),
    navOpen: document.getElementById("nav-open"),
    navClose: document.getElementById("nav-close"),
    navOverlay: document.getElementById("nav-overlay"),

    /** User **/
    userCartButton: document.getElementById("cart-button"),
    userCartQuantity: document.getElementById("cart-quantity"),
    userCartQuantityValue: document.querySelector(".cart-quantity__value"),
    userCartDropdown: document.getElementById("cart-dropdown"),
    userCartDropdownList: document.querySelector(".cart-item ul"),
    templateCartItem: {
      template: document.getElementById("cart-item__template"),
      cloneTemplate() {
        const cartClone = this.template.content.cloneNode(true);
        const cloneDOM = {
          cartItem: cartClone.querySelector("li"),
          cartImage: cartClone.querySelector("li > img"),
          cartProduct: cartClone.querySelector("h3"),
          cartPrice: cartClone.querySelector(".cart-item__price"),
          cartQuantity: cartClone.querySelector(".cart-item__quantity"),
          cartTotal: cartClone.querySelector(".cart-item__total"),
          cartDelete: cartClone.querySelector(".cart-item__delete"),
        };
        return { cartClone, ...cloneDOM };
      },
    },

    /*Main*/
    main: document.getElementsByTagName("main")[0],

    /** Preview **/
    previewThumbnailFirst: document.querySelector(
      ".product__preview-thumbnails li:first-child img"
    ),
    previewThumbnailNext: document.querySelectorAll(".product__preview-next"),
    previewThumbnailPrevious: document.querySelectorAll(
      ".product__preview-previous"
    ),
    previewImages: document.querySelectorAll(".product__preview-image img"),
    thumbnailListButtons: document.querySelectorAll(
      ".product__preview-thumbnails button"
    ),
    thumbnailSelected: () =>
      document.querySelectorAll(
        `.product__preview-thumbnails button[data-id="${
          this.#currentThumbnailID
        }"]`
      ),

    /** Content **/
    productName: document.querySelector(".product__content h1"),

    /** Price **/
    priceCurrentAmount: document.querySelector(".price__current-amount"),

    /** Cart **/
    cartQtyDecrease: document.getElementById("productCartDecrease"),
    cartQtyIncrease: document.getElementById("productCartIncrease"),
    cartQtyValue: document.getElementById("product-quantity"),
    cartAdd: document.getElementById("add-cart"),

    /*Lightbox*/
    lightboxPreview: document.querySelector("#preview-lightbox"),
    lightboxOpen: document.querySelector(".product__preview-image"),
    lightboxClose: document.getElementById("lightbox-close"),
  };

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
    const { mediaTablet, lightboxPreview } = this.#cartDOM;

    function handleChange(e) {
      if (e.matches) {
        this.navExpand(false, false);
        lightboxPreview.close();
      }
    }

    mediaTablet.addEventListener("change", handleChange.bind(this));
  }

  openCartDropdown() {
    const { userCartButton, userCartDropdown } = this.#cartDOM;

    userCartDropdown.style.display = "block";
    userCartButton.setAttribute("aria-expanded", true);
  }

  toggleCartDropdown() {
    const { userCartButton, userCartDropdown, cartAdd } = this.#cartDOM;

    const handleAnimation = () => {
      userCartDropdown.style.display = "none";
    };

    cartAdd.addEventListener("click", () => {
      this.openCartDropdown();
      userCartDropdown.removeEventListener("animationend", handleAnimation);
    });

    userCartButton.addEventListener("click", () => {
      const isExpanded = userCartButton.getAttribute("aria-expanded");
      if (isExpanded === "false") {
        this.openCartDropdown();
        userCartDropdown.removeEventListener("animationend", handleAnimation);
      } else {
        userCartButton.setAttribute("aria-expanded", false);
        userCartDropdown.addEventListener("animationend", handleAnimation);
      }
    });
  }

  navExpand(isExpand, withAnimation = true) {
    const { nav, navOpen } = this.#cartDOM;

    if (isExpand || (!isExpand && !withAnimation)) {
      navOpen.setAttribute("aria-expanded", isExpand);
    } else {
      nav.addEventListener(
        "animationend",
        () => {
          navOpen.setAttribute("aria-expanded", isExpand);
        },
        { once: true }
      );
    }
  }

  toggleMenu() {
    const { nav, navOpen, navClose, navOverlay } = this.#cartDOM;

    navOpen.addEventListener("click", () => {
      nav.classList.replace("close", "open");
      this.navExpand(true);
    });

    navClose.addEventListener("click", () => {
      nav.classList.replace("open", "close");
      this.navExpand(false);
    });

    navOverlay.addEventListener("click", (e) => {
      const targetID = e.target.getAttribute("id");
      if (targetID === "nav-overlay") {
        nav.classList.replace("open", "close");
        this.navExpand(false);
      }
    });
  }

  initProductQuantity() {
    const { cartQtyDecrease, cartQtyIncrease, cartQtyValue } = this.#cartDOM;

    cartQtyDecrease.addEventListener("click", () => {
      if (this.#productQuantity > 0) {
        this.#productQuantity--;
        cartQtyValue.textContent = this.#productQuantity;
      }
    });

    cartQtyIncrease.addEventListener("click", () => {
      this.#productQuantity++;
      cartQtyValue.textContent = this.#productQuantity;
    });
  }

  initAddToCart() {
    const {
      cartAdd,
      cartQtyValue,
      main,
      priceCurrentAmount,
      productName,
      previewThumbnailFirst,
    } = this.#cartDOM;
    const productID = main.dataset["productID"];

    cartAdd.addEventListener("click", () => {
      if (this.#productQuantity > 0) {
        const findCart = this.#userCart.find(
          ({ cartProductID }) => cartProductID == productID
        );

        if (findCart) {
          findCart.qty += Number(cartQtyValue.textContent) || 0;
        } else {
          this.#userCart.push({
            id: this.#currentID,
            productID: main.dataset["productID"],
            thumbnail: previewThumbnailFirst.getAttribute("src"),
            product: productName.textContent,
            qty: Number(cartQtyValue.textContent) || 0,
            price: priceCurrentAmount.textContent,
          });
        }
        cartQtyValue.textContent = "0";
        this.#productQuantity = 0;
        this.#currentID++;
        this.initCartItems();
        this.updateUserCartCount();
      } else {
        alert("Quantity must be greater than 0.");
      }
    });
  }

  updateUserCartCount() {
    const { userCartQuantity, userCartQuantityValue } = this.#cartDOM;
    const cartQuantity = this.#userCart.reduce(
      (sumQty, { qty }) => sumQty + qty,
      0
    );
    userCartQuantityValue.textContent = cartQuantity;

    userCartQuantity.setAttribute("aria-hidden", cartQuantity ? false : true);
  }

  initCartItems() {
    const { templateCartItem, userCartDropdownList } = this.#cartDOM;

    const fragment = new DocumentFragment();

    for (let i = 0; i < this.#userCart.length; i++) {
      const { id, thumbnail, product, qty, price } = this.#userCart[i];

      const {
        cartClone,
        cartItem,
        cartImage,
        cartProduct,
        cartPrice,
        cartQuantity,
        cartTotal,
        cartDelete,
      } = templateCartItem.cloneTemplate();

      const priceNumber = Number(price.trim().replace("$", "")) || 0;

      cartItem.setAttribute("data-id", id);
      cartItem.setAttribute("aria-label", `Cart ${i + 1}.`);
      cartImage.setAttribute("src", thumbnail);
      cartProduct.textContent = product;
      cartPrice.textContent = price;
      cartQuantity.textContent = qty;
      cartTotal.textContent = `$${(priceNumber * qty).toFixed(2)}`;
      cartDelete.setAttribute("aria-label", `Delete cart ${i + 1}`);

      cartDelete.addEventListener("click", (e) => {
        const cartID = Number(e.currentTarget.parentElement.dataset["id"]);

        this.#userCart = this.#userCart.filter(({ id }) => !(id === cartID));
        this.initCartItems();
        this.updateUserCartCount();
      });
      fragment.append(cartClone);
    }

    userCartDropdownList.replaceChildren();
    userCartDropdownList.appendChild(fragment);
  }

  initPreviewImage() {
    this.previewNext();
    this.previewPrevious();
  }

  previewNext() {
    const { previewThumbnailNext } = this.#cartDOM;

    previewThumbnailNext.forEach((previewNext) => {
      const productImageButton = previewNext.parentElement.querySelector(
        ".product__preview-image"
      );

      previewNext.addEventListener("click", () => {
        let imageNextID = Number(productImageButton.dataset["id"]) + 1;
        imageNextID = imageNextID < this.#productImage.length ? imageNextID : 0;

        this.#currentThumbnailID = imageNextID;
        this.selectedPreviewThumbnail();
      });
    });
  }

  previewPrevious() {
    const { previewThumbnailPrevious } = this.#cartDOM;

    previewThumbnailPrevious.forEach((previewPrevious) => {
      const productImageButton = previewPrevious.parentElement.querySelector(
        ".product__preview-image"
      );

      previewPrevious.addEventListener("click", () => {
        let imageNextID = Number(productImageButton.dataset["id"]) - 1;
        imageNextID =
          imageNextID >= 0 ? imageNextID : this.#productImage.length - 1;

        this.#currentThumbnailID = imageNextID;
        this.selectedPreviewThumbnail();
      });
    });
  }

  selectedPreviewThumbnail() {
    const { previewImages, thumbnailListButtons, thumbnailSelected } =
      this.#cartDOM;

    for (let thumbnail of thumbnailListButtons) {
      thumbnail.setAttribute("aria-selected", false);
    }

    for (let thumbnailButton of thumbnailSelected()) {
      thumbnailButton.setAttribute("aria-selected", true);
    }

    for (let previewImage of previewImages) {
      previewImage.parentElement.dataset["id"] = this.#currentThumbnailID;
      previewImage.setAttribute(
        "src",
        this.#productImage[this.#currentThumbnailID].image
      );
    }
  }

  initPreviewThumbnails() {
    const { thumbnailListButtons } = this.#cartDOM;

    const eventHandler = (e) => {
      this.#currentThumbnailID = e.currentTarget.dataset["id"];
      this.selectedPreviewThumbnail();
    };

    for (let thumbnail of thumbnailListButtons) {
      thumbnail.addEventListener("click", eventHandler);
    }
  }

  initLightbox() {
    const { lightboxOpen, lightboxClose } = this.#cartDOM;

    lightboxOpen.addEventListener("click", this.showLightbox);
    lightboxClose.addEventListener("click", this.closeLightbox.bind(this));
  }

  showLightbox = () => {
    const fontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );

    const windowWidth = window.innerWidth;
    const widthEM = windowWidth / fontSize;

    if (widthEM > 50) {
      const { lightboxPreview } = this.#cartDOM;

      lightboxPreview.showModal();
    }
  };

  closeLightbox() {
    const { lightboxPreview } = this.#cartDOM;
    lightboxPreview.close();
  }
}
