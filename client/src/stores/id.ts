import { writable } from "svelte/store";
const idToEdit= writable<string>();
export default idToEdit;