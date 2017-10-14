// ---------------------------------------------
// Bus event mediator
// ---------------------------------------------

var bus = new Vue();

// ---------------------------------------------
// Components
// ---------------------------------------------

Vue.component("app-movie-product", {
	template: "#vue-app-movie-product",
	props: ['movie']	
});

// ---------------------------------------------
// Main instance
// ---------------------------------------------

new Vue({
	el: "#app",
	data: {
		productsJsonUrl: "json/products.json",
		movies: []
	},
	mounted: function(){
		this.loadMovies(this.productsJsonUrl);
	},
	methods: {
		loadMovies: function(url) {
			axios.get(url).then(response => this.movies = response.data);
		}
	}
});

