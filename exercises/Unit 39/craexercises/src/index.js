import { choice, remove } from "./helpers";
import fruits from "./foods";

const RANDOMFRUIT = choice(fruits);
console.log(`I'd like one ${RANDOMFRUIT}, please.`);
console.log(`Here you go: ${RANDOMFRUIT}`);
console.log(`Delicious! May I have another?`);
const FRUITSLEFT = remove(fruits, RANDOMFRUIT);
console.log(`I'm sorry, we're all out. We have ${FRUITSLEFT.length} left`)
