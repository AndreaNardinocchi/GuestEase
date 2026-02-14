import type { Review } from "../types/interfaces";

/**
 * The avgRating is the average rating for the room caluculated through
 * the reduce() function, whose function is 'iterate and “reduce” an array's values into one value.'
 * Hence, we extrapolate each of the ratings and we 'sum' them (r.rating, while '0' is the initial number)
 * https://www.freecodecamp.org/news/how-to-use-javascript-array-reduce-method/
 * https://forum.freecodecamp.org/t/how-to-compute-the-average-rating-use-the-reduce-method-to-analyze-data-solved/198305
 */

export function calculateAverageRating(reviews: Review[] = []): number {
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Number((total / reviews.length).toFixed(1));
}
