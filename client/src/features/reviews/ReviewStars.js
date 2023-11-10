import { useState, useCallback, useRef } from "react";
import { FaStar } from "react-icons/fa";
import useDebounce from "./useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { addReview, getReviewByUser } from "./reviewSlice";
import { addReviewDb } from "./sendReview";

export function ReviewStars({ readonly, productId }) {
  const [rating, setRating] = useState(readonly ? 5 : null);
  const [hover, setHover] = useState(null);

  const dispatch = useDispatch();
  const currUser = useSelector((state) => state.user.userEmail);
  const currReview = useSelector((state) =>
    getReviewByUser(state, currUser, productId)
  );

  const handleReview = (curr) => {
    setRating(curr);
  };

  return (
    <div>
      {[...Array(5)].map((_, i) => {
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
      })}
    </div>
  );
}
