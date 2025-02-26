// CHANGE COMPLETED --

const Color = require("../../../models/colorSchema");

// COLOR ADD API
const colorAdd = async (req, res, next) => {
  try {
    const { color_name, color_code } = req.body;

    // Check if color_name is provided
    if (!color_name) {
      const error = new Error("Color name is required");
      error.status = 400;
      return next(error);
    }

    // Check if color_code is provided
    if (!color_code) {
      const error = new Error("Color code is required");
      error.status = 400;
      return next(error);
    }

    const new_color = new Color({ color_name, color_code });
    await new_color.save();

    res
      .status(200)
      .json({ success: true, message: "Color added successfully" });
  } catch (err) {
    next(err);
  }
};

// COLOR EDIT API
const colorEdit = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { color_name, color_code } = req.body;

    // Check if id is provided
    if (!id) {
      const error = new Error("Color id not found");
      error.status = 400;
      return next(error);
    }

    // Check if color_name is provided
    if (!color_name) {
      const error = new Error("Color name is required");
      error.status = 400;
      return next(error);
    }

    // Check if color_code is provided
    if (!color_code) {
      const error = new Error("Color code is required");
      error.status = 400;
      return next(error);
    }

    let color = await Color.findOne({ _id: id });

    // Check if color_code is provided
    if (!color) {
      const error = new Error("Color not available");
      error.status = 400;
      return next(error);
    }


    color.color_name = color_name;
    color.color_code = color_code;

    await color.save();

    res.status(200).json({success:true, message:"Color has been successfully updated"});

  } catch (err) {
    next(err);
  }
};

// COLOR DELETE API
const colorDelete = async (req, res, next) => {
  try {
    const id = req.query.id;

    // Check if id is provided
    if (!id) {
      const error = new Error("Color id not found");
      error.status = 400;
      return next(error);
    }

    const updatedData = await Color.updateOne(
      { _id: id },
      { $set: { deleted: "true" } }
    );

    if (!updatedData) {
      const error = new Error('Color does not exist');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({success:true, message:'Color has been deleted'})
  } catch (err) {
    next(err);
  }
};

// COLOR RESTORE API
const colorRestore = async (req, res, next) => {
  try {
    const id = req.query.id;

    // Check if id is provided
    if (!id) {
      const error = new Error("Color id not found");
      error.status = 400;
      return next(error);
    }

    const updatedData = await Color.updateOne(
      { _id: id },
      { $set: { deleted: "false" } }
    );
    
    if (!updatedData) {
      const error = new Error('Color does not exist');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({success:true, message:' Color has been restored'})

  } catch (err) {
    next(err);
  }
};

// COLOR PERMENENT DELETE API
const colorPermenentDelete = async (req, res, next) => {
  try {
    await Color.deleteMany({ deleted: true });
    res.status(200).json({success:true, message:"Color has been permanently removed"})
  } catch (err) {
    next(err);
  }
};

//Export
module.exports = {
  colorAdd,
  colorEdit,
  colorDelete,
  colorRestore,
  colorPermenentDelete,
};
