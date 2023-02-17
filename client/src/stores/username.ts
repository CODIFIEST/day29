import { writable } from "svelte/store";

const username = writable<string>();
export default username