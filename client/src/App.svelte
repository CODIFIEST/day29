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
          <button class="btn" on:click={toggleDisplay}>Show/Hide Users</button>
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
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
