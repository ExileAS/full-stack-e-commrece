const Product = require("../models/productModel");

const handleAddMain = (updates) => {
  for (let id in updates) {
    async function update() {
      const result = await Product.findOneAndUpdate(
        { id: id },
        { onhand: updates[id] }
      );
      //console.log(result);
    }
    update();
  }
};

const handlePatchDeleteMain = async (updates) => {
  for (let id in updates) {
    async function update() {
      const result = await Product.findOneAndUpdate(
        { id: id },
        { $inc: { onhand: updates[id] } }
      );
    }
    update();
  }
};

module.exports = { handleAddMain, handlePatchDeleteMain };
