const { ProductModel } = require("../models/productModel");

const handleAddMain = (updates) => {
  const promiseArr = [];
  for (const id in updates) {
    promiseArr.push(
      ProductModel.findOneAndUpdate({ id: id }, { onhand: updates[id] })
    );
  }
  Promise.all(promiseArr);
};

const handlePatchDeleteMain = (updates) => {
  const promiseArr = [];
  for (const id in updates) {
    promiseArr.push(
      ProductModel.findOneAndUpdate(
        { id: id },
        { $inc: { onhand: updates[id] } }
      )
    );
  }
  Promise.all(promiseArr);
};

module.exports = { handleAddMain, handlePatchDeleteMain };
