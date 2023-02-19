<script lang="ts">
    import axios from "axios";
    import isLoggedIn from "../stores/isLoggedIn";

    let email: string = "";
    let password: string = "";
  
    async function submitForm() {
        console.log(email, password);
        if (password && email) {
            const result = await axios
                .post("https://day29-neon.vercel.app/login", {
                    email: email,
                    password: password,
                })
                .then((res) => {
                    document.cookie = res.data.token;
                    alert("login successful");
                    console.log("result.data", res.data);
                    isLoggedIn.set(true);
                    
                })
                .catch((error) => {
                    alert(error);
                })
                .finally(() => {
                    
                });
            // get token from fetch request
        }
    }
    async function logout() {
        document.cookie = null;
        isLoggedIn.set(false);
    }
</script>

{#if $isLoggedIn }
<button
on:click={async () => {
    await logout();
    // these next two lines reload the page
    location.reload();
    return false;
}}
class="btn">Log Out</button
>



{:else}
<label for="my-modal-5" class="btn">Log In</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal-5" class="modal-toggle" />
<label for="my-modal-5" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
        <div style="float: right;">
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
                if (password && email) {
                    await submitForm();

                    // these next two lines reload the page
                    // location.reload();
                    // return false;
                }
            }}
            class="btn">Submit</button
        >
        
        <!-- add another button/modal here for creating user
        bottom left of form -->
    </label>
</label>

{/if}

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
