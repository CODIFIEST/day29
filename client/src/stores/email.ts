import { writable } from "svelte/store";

const email = writable<string>();
export default email