// ---------------------------------------------
// Bus mediator
// ---------------------------------------------

var bus = new Vue();


// ---------------------------------------------
// Main instance
// ---------------------------------------------

var app = new Vue({
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

