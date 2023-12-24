const { OrderedProductModel } = require("../models/oderedProductsModel");

const handleDeleteRedundant = async (info, list, confirmId) => {
  const { userEmail } = info;
  try {
    const existingOrder = await OrderedProductModel.findOne({
      "customerInfo.userEmail": userEmail,
    });
    if (!existingOrder) return;
    if (existingOrder.confirmId === confirmId) {
      return;
    }
    const existingList = existingOrder.list;
    const existingId = existingOrder._id;
    let count = 0;
    for (let p of existingList) {
      let redundant = list.find(({ id }) => p.id === id);
      if (redundant) count++;
    }

    if (count === existingList.length) {
      const res = await OrderedProductModel.deleteOne({ _id: existingId });
      return existingOrder.confirmId;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleDeleteRedundant };
