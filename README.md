# Frontend Mentor - E-commerce product page solution

This is a solution to the [E-commerce product page challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/ecommerce-product-page-UPsZ9MJp6). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

**Note: Delete this note and update the table of contents based on what sections you keep.**

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the site depending on their device's screen size
- See hover states for all interactive elements on the page
- Open a lightbox gallery by clicking on the large product image
- Switch the large product image by clicking on the small thumbnail images
- Add items to the cart
- View the cart and remove items from it

### Screenshot

![Mobile](<screenshot/e-commerce - mobile.png>)
![Mobile - empty cart](<screenshot/e-commerce - mobile - empty cart.png>)
![Mobile - filled cart](<screenshot/e-commerce - mobile - filled cart.png>)
![Desktop](<screenshot/e-commerce - desktop.png>)
![Desktop - empty cart](<screenshot/e-commerce - desktop - empty cart.png>)
![Desktop - filled cart](<screenshot/e-commerce - desktop - filled cart.png>)

### Links

- Solution URL: [Github](https://github.com/AJ-Tan/16.-Frontend-Mentor---E-commerce-product-page-HTML-SASS-JS-/tree/main)
- Live Site URL: [Github Pages](https://aj-tan.github.io/16.-Frontend-Mentor---E-commerce-product-page-HTML-SASS-JS-/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Javascript

### What I learned

1. Using matchMedia to trigger function upon window matches certain size.

```js
  windowResize() {
    const mediaQuery = window.matchMedia("(max-width: 50em)");

    function handleChange(e) {
      if (e.matches) {
        ...
      }
    }

    handleChange(mediaQuery); //run the code once upon init
    mediaQuery.addEventListener("change", handleChange);
  }
```

2. Using template to duplicate nodes in js.

```html
<template id="cart-item__template"> ... </template>
```

```js
  const cartItemTemplate = document.getElementById("cart-item__template");
  const cartItemList = document.querySelector(".cart-item ul");

  const fragment = new DocumentFragment(); //Store node in fragment to append to a node as one.

  for (let i = 0; i < this.#userCart.length; i++) {
    const cartItemClone = cartItemTemplate.content.cloneNode(true);
    ...
    fragment.append(cartItemClone);
  }

  cartItemList.replaceChildren(); //Clear children.
  cartItemList.appendChild(fragment); //Replace with new.
```

### Continued development

- For optimization.

## Author

- GitHub - [AJ-Tan](https://github.com/AJ-Tan)
- Frontend Mentor - [@AJ-Tan](https://www.frontendmentor.io/profile/AJ-Tan)
