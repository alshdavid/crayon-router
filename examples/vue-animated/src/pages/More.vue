<template>
    <main>
        <nav>
            <button 
              @click="nav.back()">
              &lt; Back
            </button>
        </nav>
        <h1>{{ req.routePattern }}</h1>
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
