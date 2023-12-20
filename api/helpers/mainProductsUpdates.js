const { ProductModel } = require("../models/productModel");

// try promise.all()

const handleAddMain = (updates) => {
  for (const id in updates) {
    async function update() {
      await ProductModel.findOneAndUpdate({ id: id }, { onhand: updates[id] });
    }
    update();
  }
};

const handlePatchDeleteMain = async (updates) => {
  for (const id in updates) {
    async function update() {
      await ProductModel.findOneAndUpdate(
        { id: id },
        { $inc: { onhand: updates[id] } }
      );
    }
    update();
  }
};

module.exports = { handleAddMain, handlePatchDeleteMain };
