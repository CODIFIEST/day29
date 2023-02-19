<script lang="ts">
    // import email from "../stores/email";
    // import username from "../stores/username";
    import axios from "axios";
    import isLoggedIn from "../stores/isLoggedIn";
    let username: string = "";
    let email: string = "";
    let password: string = "";

    async function submitForm() {
        console.log(email, username, password);
        if (username && email) {
            const result = await axios.post(
                "https://day29-neon.vercel.app/user",
                {
                    email: email,
                    username: username,
                    password: password,
                },
                {
                    // headers: // TODO: add authentication to header on login, maybe not here on creation
                }
            );
            console.log(result.data);
        }
    }
</script>

<!-- {#if !$isLoggedIn}
    <label for="my-modal-4" class="btn">Register</label>
{:else}
    <label for="my-modal-4" class="btn">Add User</label>
{/if}


<input type="checkbox" id="my-modal-4" class="modal-toggle" />
<label for="my-modal-4" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
        <div style="float: right;">
            username: <input
                bind:value={username}
                class="input input-bordered input-primary w-full max-w-xs"
                type="text"
            />
            <br />
            email:
            <input
                bind:value={email}
                class="input input-bordered input-primary w-full max-w-xs"
                type="text"
            />
            <br />
            password:
            <input
                bind:value={password}
                class="input input-bordered input-primary w-full max-w-xs"
                type="text"
            />
        </div>
        <button
            on:click={async () => {
                console.log("button clicked");
                if (username && email) {
                    await submitForm();
                    // these next two lines reload the page
                    // location.reload();
                    // return false;
                }
            }}
            class="btn">Submit</button
        >
    </label>
</label> -->

<!-- The button to open modal -->
<label for="my-modal" class="btn">Add New User</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
    <div class="modal-box">
        <div class="grid grid-cols-1 gap-4 text-right">
            <div>
                username: <input
                    bind:value={username}
                    class="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                />
            </div>
            <div>
                email:
                <input
                    bind:value={email}
                    class="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                />
            </div>
            <div>
                password:
                <input
                    bind:value={password}
                    class="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                />
            </div>
            <div>
                <button
                    on:click={async () => {
                        location.reload();
                        return false;
                    }}
                    class="btn">Cancel</button
                >
            </div>
        </div>

        <div class="modal-action">
            <label
                on:click={async () => {
                    console.log("button clicked");
                    if (username && email) {
                        await submitForm();
                        alert("User created successfully");
                        // these next two lines reload the page
                        // location.reload();
                        // return false;
                    }
                }}
                on:keypress={async () => {
                    if (username && email) {
                        await submitForm();
                    }
                }}
                for="my-modal"
                class="btn">Submit</label
            >
        </div>
    </div>
</div>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
