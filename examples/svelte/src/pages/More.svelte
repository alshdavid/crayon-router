<script>
	export let req
	export let nav
</script>

<nav>
	<button 
		on:click={() => nav.back()}>
		&lt; Back
	</button>
</nav>
<h1>{ req.routePattern }</h1>

