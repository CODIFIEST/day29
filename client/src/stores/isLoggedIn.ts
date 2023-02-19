import { writable } from "svelte/store";

const isLoggedIn = writable<boolean>();
export default isLoggedIn;