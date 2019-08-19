<script>
	export let req
	export let nav
</script>

<nav>
	<button 
		on:click={() => nav.navigate('/home')}>
		Home
	</button>
	<button
		on:click={() => nav.navigate('/about')}>
		About
	</button>
	<button
		class="anchored" 
		on:click={() => nav.navigate('/more')}>
		More &gt;
	</button>
</nav>
<h1>{ req.routePattern }</h1>

