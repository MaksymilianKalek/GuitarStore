const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated
} = require("../config/auth");
const fs = require("fs");
const Cart = require("../models/Cart");

let products = JSON.parse(fs.readFileSync("data/products.json", "utf8"));

//Welcome Page
router.get("/", (req, res) => res.render("welcome"));

//Main Page
router.get("/main", ensureAuthenticated, (req, res) =>
  res.render("main", {
    name: req.user.name
  }));

//Guitar page
router.get("/guitars", ensureAuthenticated, (req, res) =>
  res.render("guitars", {
    name: req.user.name,
    products: products
  }));

//Amp page
router.get("/amps", ensureAuthenticated, (req, res) =>
  res.render("amps", {
    name: req.user.name,
    products: products
  }));

//Contact page
router.get("/contact", ensureAuthenticated, (req, res) =>
  res.render("contact", {
    name: req.user.name,
    email: req.user.email
  }));

//Cart page
router.get("/cart", ensureAuthenticated, (req, res, next) => {
  if (!req.session.cart) {
    return res.render("cart", {
      name: req.user.name,
      products: null
    });
  }

  let cart = new Cart(req.session.cart);
  res.render("cart", {
    name: req.user.name,
    products: cart.getItems(),
    totalPrice: cart.totalPrice,
    totalItems: cart.totalItems
  });
});

//Adding to cart
router.get("/add/:id", ensureAuthenticated, (req, res, next) => {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  let product = products.filter(function (item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  if (productId < 100) {
    res.redirect("/guitars");
  } else {
    res.redirect("/amps");
  }
});

//Removing from cart
router.get("/remove/:id", ensureAuthenticated, (req, res, next) => {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect("/cart");
});

//Checkout page
router.get("/checkout", ensureAuthenticated, (req, res) => {
  if (!req.session.cart) {
    return res.render("cart", {
      name: req.user.name,
      products: null
    });
  }

  let cart = new Cart(req.session.cart);

  res.render("checkout", {
    name: req.user.name,
    email: req.user.email,
    products: cart.getItems(),
    totalPrice: cart.totalPrice,
    totalItems: cart.totalItems
  });
});

//Checkout handler
router.post("/buy", ensureAuthenticated, (req, res) => {
  const {
    name,
    email,
    city,
    address,
    message
  } = req.body;

  let cart = new Cart(req.session.cart);

  const products = cart.getItems();
  const totalPrice = cart.totalPrice;
  const totalItems = cart.totalItems;

  fs.writeFile(`./orders/orderFrom${name}.txt`, `Sender: ${name}\nEmail: ${email}\nCity: ${city}\nAddress: ${address}\nOther information: ${message}\nTotal items: ${totalItems}\nTotal cost: ${totalPrice}€\n`, "utf8", (err) => {
    if (err) throw err;
    console.log("File created");
  });

  let i = 1;
  products.forEach(product => {
    fs.appendFile(`./orders/orderFrom${name}.txt`, `\nProduct no.${i}: ${product.item.name} | Quantity: ${product.quantity} | Price: ${product.item.price}`, "utf8", (err) => {
      if (err) throw err;
      console.log("Appended to file");
    });
    i += 1;
  });

  req.flash("success_msg", "Your order has been placed");
  res.redirect("/checkout");
});

module.exports = router;