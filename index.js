import express from "express";
import { sequelize } from "./models/model.js";
import Product from "./models/product.js";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// data tidak boleh kosong
const data = (req, res, next) => {
  if (
    req.body.price <= 0 ||
    isNaN(req.body.price) ||
    req.body.name.trim() == ""
  ) {
    console.log("Data tidak sesuai format");
    res.json({ status: 400 });
  } else {
    next();
  }
};

// biar tabel otomatis terbuat dulu
try {
  sequelize.authenticate();
  Product.sync();
  console.log("Tabel Product berhasil dibuat");
} catch {
  res.end("Error !!!");
}

app.get("/", (req, res) => {
  Product.findAll().then((results) => {
    res.render("index", { products: results });
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/edit/:id", (req, res) => {
  Product.findOne({ where: { id: req.params.id } }).then((results) => {
    res.render("edit", { product: results });
  });
});

app.post("/api/products", data, (req, res, next) => {
  Product.create({
    name: req.body.name,
    price: req.body.price,
  })
    .then((results) => {
      res.json({ status: 200, error: null, Response: results });
    })
    .catch((err) => {
      res.json({ status: 502, error: err });
    });
});

app.put("/api/product/:id", data, (req, res, next) => {
  Product.update(
    {
      name: req.body.name,
      price: req.body.price,
    },
    { where: { id: req.params.id } }
  )
    .then((results) => {
      res.json({ status: 200, error: null, Response: results });
    })
    .catch((err) => {
      res.json({ status: 502, error: err });
    });
});

app.delete("/api/product/:id", (req, res) => {
  Product.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.json({ status: 200, error: null, Response: results });
    })
    .catch((err) => {
      res.json({ status: 500, error: err, Response: {} });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
