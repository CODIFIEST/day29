<script lang="ts">
    import axios from "axios";
    import { onMount } from "svelte";
    import type { UserC } from "../domain/user";
    import editUser from "../stores/editUser";
    import email from "../stores/email";
    import idToEdit from "../stores/id";
    import username from "../stores/username";

    let users: UserC[] = [];
    async function getUsers() {
        const result = await axios.get("https://day29-neon.vercel.app/user");
        console.log("results", result.data);
        return result.data;
    }
    onMount(async () => {
        users = (await getUsers()) as any as UserC[];
        console.log("users", users);
    });
</script>

<!-- The button to open modal -->
<!-- <label for="my-modal-6" class="btn">Display Users</label> -->

<!-- Put this part before </body> tag -->
<!-- <input type="checkbox" id="my-modal-6" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
    <div class="modal-box"> -->
{#each users as user}
    <div
        on:click={async () => {
            idToEdit.set(user.id);
            editUser.set(true);
            username.set(user.username);
            email.set(user.email);
            console.log($idToEdit);
        }}
        on:keypress={() => {
            alert("nope");
        }}
        id={user.id}
    >
        <br /> Name:{user.username} Email:{user.email}
    </div>
{/each}

<!-- <div class="modal-action">
            <label for="my-modal-6" class="btn">Yay!</label>
        </div>
    </div>
</div> -->
<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
