interface FoodImage {
  src: string;
  position?: string;
  scale?: number;
}

export const FOOD_IMAGES: Record<string, FoodImage> = {
  "club sandwich": { src: "/food/club-sandwich.jpg", scale: 1.3 },
  "matcha chiller": { src: "/food/matcha-drink.jpg", position: "center 38%", scale: 1.7 },
  "cherry tart": { src: "/food/cherry-tart.jpg", position: "center 82%", scale: 1.35 },
  "blueberry shake": { src: "/food/blueberry-shake.jpg", position: "center 30%", scale: 1.25 },
  "loaded tater tots": { src: "/food/tater-tots.jpg", scale: 1.15 },
  "chicken shawarma bowl": { src: "/food/chicken-bowl.jpg", scale: 1.15 },
  "creamy cajun alfredo": { src: "/food/pasta.jpg", scale: 1.15 },
  "chicken biryani": { src: "/food/chicken-biryani.jpg" },
  "beef burger": { src: "/food/beef-burger.jpg", position: "center 42%", scale: 1.3 },
  "fresh juice": { src: "/food/fresh-juice.jpg", scale: 1.15 },
};
