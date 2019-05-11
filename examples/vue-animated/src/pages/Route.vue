<template>
  <main>
    <nav>
      <button 
        @click="nav.navigate('/home')">
        Home
      </button>
      <button 
        @click="nav.navigate('/about')">
        About
      </button>
      <button 
        class="anchored"
        @click="nav.navigate('/more')">
        More &gt;
      </button>
    </nav>
    <h1>{{ req.pathname }}</h1>
  </main>
</template>

<script>
export default {
  props: {
    nav: null,
    req: null
  }
}
</script>

