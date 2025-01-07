const express = require("express");
const router = express.Router();
const categoryController = require("../../controller/admin/categoryController.js");
const productController = require("../../controller/admin/productController.js");
const upload = require("../../middleware/uploads.js");

router.get("/", async (req, res) => {
  try {
    const data = await productController.getAll();
    res.render("admin/productView.ejs", {
      currentPage:'product',
      products: data.products,
      deleted: data.deleted_product,
    });
  } catch (err) {
    res.status(500).render("error", { err });
  }
});

//add product
router.get("/add", async (req, res) => {
  try {
    const data = await categoryController.getAll();

    res.render("admin/productAdd.ejs", { categories: data.categories });
  } catch (err) {
    res.status(500).render("error", { err });
  }
});

router.post("/add", upload.single("product_image"), async (req, res) => {
    const data = req.body;
    const image = req.file;
  try {
    await productController.add(data, image);
    res.redirect('/admin/products')
  } catch (err) {
    res.status(500).render("error", { err });
  }
});

//edit product
router.get("/edit", async (req, res) => {
    try{
        const product = await productController.getOne(req.query.id);
        const categories = (await categoryController.getAll()).categories;
      
        res.render("admin/productEdit.ejs", { categories, product });
    }catch(err){
        res.status(500).render("error", { err });
    }
});

router.put('/edit',upload.single('images'), async (req, res)=>{
    const id = req.query.id;
    const data = req.body;
    const image = req.file;

    try{
        await productController.update(id, data, image);
        res.status(200).redirect('/admin/product');
    }catch(err){
        res.status(500).render("error", { err });
    }
})

//Soft Delete product
router.delete('/delete', async(req, res)=>{
    const id = req.query.id;
    try{
        await productController.softDelete(id, {deleted: true});
        res.status(200).redirect('/admin/product');
    }catch(err){
        res.status(500).render("error", { err });
    }
})

//Recover product
router.put('/recover', async (req, res)=>{
    const id = req.query.id;

    try{
        await productController.softDelete(id, { deleted: false })
        res.status(200).redirect('/admin/product')
    }catch(err){
        res.status(500).render("error", { err });
    }
});


//Permenent delete all
router.delete('/delete-all', async (req, res)=>{
    try{
        await productController.deleteAll()
        res.redirect('/admin/product')
    }catch(er){
        res.status(500).render("error", { err });
    }
})

module.exports = router;
