const OrderedProducts = require("../models/oderedProductsModel");

const handleDeleteRedundant = async (info, list, confirmId) => {
  const { userEmail } = info;
  try {
    const existingOrder = await OrderedProducts.findOne({
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
      //console.log("deleted");
      const res = await OrderedProducts.deleteOne({ _id: existingId });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleDeleteRedundant };
