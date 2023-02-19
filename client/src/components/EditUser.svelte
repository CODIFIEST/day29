<script lang="ts">
    import email from "../stores/email";
    import idToEdit from "../stores/id";
    import username from "../stores/username";
    import axios from "axios";
    import type { UserC } from "../domain/user";
    import editUser from "../stores/editUser";
    let name: string = "";
    let emailaddy: string = "";

    async function putUser() {
        const newUser: UserC = {
            id: $idToEdit,
            username: name,
            email: emailaddy,
        };
        const result = await axios.put(
            "https://day29-neon.vercel.app/user/:id",
            newUser, {
                // withCredentials: true,
                headers: {Authorization : `Bearer ${document.cookie}`}
                
            }

            
        )
        .then((res)=>{
            // alert(res.statusText)
        })
        .catch((error)=>{
            alert(error);
        })
        .finally(()=>{
        editUser.set(false);
        return result.data;
        })
        
    }
</script>

<main>
    <div style="float:right">
        name: {$username} <br>

        <input
            class="input input-bordered input-primary w-full max-w-xs"
            bind:value={name}
            type="text"
            placeholder={$username}
        />
        <br />
        email: {$email}
        <input
            class="input input-bordered input-primary w-full max-w-xs"
            bind:value={emailaddy}
            type="text"
            placeholder={$email}
        />
    </div>
    
    <button
        on:click={async () => {
            await putUser();
            location.reload();
            return false;
        }}
        class="btn">Submit changes</button
    >
    <br><br>
    <button
        on:click={async ()=>{
            location.reload();
            return false;
        }}    
        class="btn"
    >Cancel</button>
</main>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
