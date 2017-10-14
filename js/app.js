// ---------------------------------------------
// Bus mediator
// ---------------------------------------------

var bus = new Vue();

// ---------------------------------------------
// Components
// ---------------------------------------------

Vue.component("app-movie-products", {
	template: "#vue-app-movie-product",
	props: ['movies'],
	data: function() {
		return {
			productsJsonUrl: "json/products.json",
		}
	},
	mounted: function(){
		this.loadMovies(this.productsJsonUrl);
	},
	methods: {
		loadMovies: function(url) {
			axios.get(url).then(response => console.log(response.data));
		}
	}
});

// ---------------------------------------------
// Main instance
// ---------------------------------------------

var app = new Vue({
	el: "#app",
	data: {

	}
});

