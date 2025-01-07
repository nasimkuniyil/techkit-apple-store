const express = require("express");
const router = express.Router();
const categoryController = require("../../controller/admin/categoryController");

router.get("/", async (req, res) => {
  try {
    const data = await categoryController.getAll();
    res.render("admin/categoryView.ejs", {
      currentPage : 'category',
      categories: data.categories,
      deleted: data.deleted,
    });
  } catch (err) {
    res.status(500).render("error", { error });
  }
});

// category ADD
router.get("/add", (req, res) => {
  res.render("admin/categoryAdd.ejs");
});

router.post("/add", async (req, res) => {
  try {
    await categoryController.add(req.body.category_name.trim());
    res.redirect("/admin/category");
  } catch (err) {
    if (err.message.includes("already exist")) {
      res.status(400).json({message:'Already exist',redirect:'/admin'});
    } else {
      console.log("Category adding error : ", err);
      res.status(500).render("error", { err });
    }
  }
});

// category Edit
router.get("/edit", async (req, res) => {
  try {
    const category = await categoryController.getOne(req.query.id);
    res.render("admin/categoryEdit.ejs", { category });
  } catch (err) {
    res.status(500).render("error", { err });
  }
});

router.put("/edit", async (req, res) => {
  const category_name = req.body.new_name.trim();
  const id = req.query.id;

  try {
    await categoryController.update(id, { category_name });
    res.redirect("/admin/category");
  } catch (err) {
    if (err.message.includes("already exist")) {
      res.status(400).render("error", { err });
    } else {
      res.status(500).render("error", { err });
    }
  }
});

// category Delete soft
router.delete("/delete", async (req, res) => {
  const id = req.query.id;

  try {
    await categoryController.update(id, { deleted: true });
    res.redirect("/admin/category");
  } catch (err) {
    res.status(500).render("error", { err });
  }
});

//Recover category
router.put("/recover", async (req, res) => {
  const id = req.query.id;

  try {
    await categoryController.update(id, { deleted: false });
    res.redirect("/admin/category");
  } catch (err) {
    res.status(500).render("error", { err });
  }
});

//Permenent Delete all items from recovery
router.delete("/delete-all", async (req, res) => {
  try {
    await categoryController.deleteAll();
    res.redirect("/admin/category");
  } catch (err) {
    res.status(500).render("error", { err });
  }
});

module.exports = router;
