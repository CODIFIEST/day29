<script lang="ts">
  import CreateUser from "./components/CreateUser.svelte";
  import DisplayUsers from "./components/DisplayUsers.svelte";
  import EditUser from "./components/EditUser.svelte";
  import editUser from "./stores/editUser";
  let displayusers: boolean = false;
  let edituser: boolean = false;
  function toggleDisplay() {
    displayusers = !displayusers;
  }
</script>

<main>
  <!-- <Header/> -->
  {#if !$editUser}
  <button class="btn" on:click={toggleDisplay}>Show/Hide Users</button>
  {/if}
  {#if !displayusers}
    <CreateUser />
  {:else if displayusers && !$editUser}
    <!--assuming you can see the user list here -->
    <DisplayUsers />
  {:else}
    <EditUser />
  {/if}
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
