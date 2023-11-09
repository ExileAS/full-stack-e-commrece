export const addReviewDb = async (info) => {
  try {
    const res = await fetch("/api/addReview", {
      method: "POST",
      body: JSON.stringify({
        id: info.productId,
        email: info.currUser,
        review: info.rating,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
