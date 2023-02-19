<script lang="ts">
  import CreateUser from "./components/CreateUser.svelte";
  import DisplayUsers from "./components/DisplayUsers.svelte";
  import EditUser from "./components/EditUser.svelte";
  import Login from "./components/Login.svelte";
  import editUser from "./stores/editUser";
  import isLoggedIn from "./stores/isLoggedIn";
  let displayusers: boolean = false;
  // let edituser: boolean = false;
  function toggleDisplay() {
    displayusers = !displayusers;
  }
</script>

<main>
  <div
    class="hero min-h-screen"
    style="background-image: url('https://www.arweave.net/hNN-l4QsOuWIRWwpOn-VDjso2NsGBW3Mg30p18Gs6zQ?ext=png');"
  >
    <div class="hero-overlay bg-opacity-60" />
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold text-secondary">Hello there</h1>
        <p class="mb-5 text-secondary">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
          excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
          id nisi.
        </p>
        <div class="container space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Login />
            </div>
            <div>
              <CreateUser />
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <!-- <Header/> -->
            {#if $isLoggedIn}
              <div>
                <button class="btn" on:click={toggleDisplay}
                  >Show/Hide Users</button
                >
              </div>
              {#if !displayusers}
                <!-- <CreateUser /> -->
              {:else if displayusers && !$editUser}
                <!--assuming you can see the user list here -->
                <div><DisplayUsers /></div>
              {:else}
                <div><EditUser /></div>
              {/if}
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
