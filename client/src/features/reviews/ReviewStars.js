import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addReviewDb,
  editReviewDb,
  fetchReviews,
  getInfoByProductId,
  getReviewByUser,
  setStatus,
} from "./reviewSlice";
import { selectProductById } from "../products/productsSlice";

export const ReviewStars = React.memo(({ readonly, productId, details }) => {
  const product = useSelector((state) => selectProductById(state, productId));
  const info = useSelector((state) => getInfoByProductId(state, productId));
  const currRating = info?.rating;
  const customers = info?.customers || [];
  const reviewCount = info?.reviewCount;
  const currUser = useSelector((state) => state.user.userEmail);
  let currUserReview = useSelector((state) =>
    getReviewByUser(state, currUser, productId)
  );
  // if (!currUserReview)
  //   currUserReview = localStorage.getItem(`${productId}review`) || 0;
  const [submitted, setSubmitted] = useState(Boolean(currUserReview));

  const [rating, setRating] = useState(readonly ? currRating : currUserReview);
  const [hover, setHover] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const status = useSelector((state) => state.review.status);
  console.log(status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchReviews());
      console.log("DISPATCHED");
    }
  }, [status, dispatch]);

  // useEffect(() => {
  //   if (submitted) localStorage.setItem(`${productId}review`, rating);
  //   // console.log(localStorage.getItem(`${productId}review`), rating, submitted);
  // }, [rating, productId, submitted]);

  const handleReview = (curr) => {
    setRating(curr);
    setSubmit(true);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!comment || !rating) return;
    setSubmitted(true);
    dispatch(setStatus());
    if (!info) {
      dispatch(
        addReviewDb({
          rating,
          comment,
          currUser,
          productId,
          productName: product.name,
        })
      );
    } else {
      console.log("EDITING");
      dispatch(
        editReviewDb({
          rating,
          comment,
          currUser,
          productId,
        })
      );
    }
  };

  const stars = [...Array(5)].map((_, i) => {
    const currRating = i + 1;
    return (
      <label key={i}>
        <input
          type="radio"
          name="rating"
          value={currRating}
          onClick={() => !readonly && handleReview(currRating)}
        />
        <FaStar
          size={24}
          className="star"
          color={currRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
          onMouseEnter={() => !readonly && setHover(currRating)}
          onMouseLeave={() => !readonly && setHover(null)}
        />
      </label>
    );
  });

  const customerReviews = customers.map((customer, i) => (
    <div key={i} className="review-container">
      <div className="comment">
        <li className="single-review">
          {customer.name.substring(0, customer.name.indexOf("@"))}
        </li>
        {[...Array(5)].map((_, i) => {
          const currRating = i + 1;
          return (
            <label key={i}>
              <input type="radio" name="rating" value={currRating} />
              <FaStar
                size={24}
                color={
                  currRating <= (hover || customer.rating)
                    ? "#ffc107"
                    : "#e4e5e9"
                }
              />
            </label>
          );
        })}
        <br />
        <p>{customer.comment}</p>
      </div>
    </div>
  ));

  return (
    <div>
      {!details && <div>{stars}</div>}
      {submit && !submitted && (
        <div>
          <input
            type="text"
            placeholder="review the product"
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="button-79" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
      {submitted && !readonly && <h3>your review has been submitted!</h3>}
      {readonly && !details && (
        <h3 className="NO-reviews">
          {reviewCount === 1 ? "1 review" : `${reviewCount || 0} reviews`}
        </h3>
      )}
      {details && (
        <div>
          {customers.length > 0 && (
            <h3 className="customer-reviews">Customer reviews:</h3>
          )}
          {customerReviews}
        </div>
      )}
    </div>
  );
});
