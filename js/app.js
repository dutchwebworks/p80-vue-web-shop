// ---------------------------------------------
// Bus event mediator
// ---------------------------------------------

var bus = new Vue();

// ---------------------------------------------
// Components
// ---------------------------------------------

Vue.component("app-movie-products", {
	template: "#vue-app-movie-products",
	data: function() {
		return {
			productsJsonUrl: "json/products.json",
			movies: [],
			filterByGenre: ''
		}
	},
	created: function() {
		var self = this;
		bus.$on("filterGenre", function(genre) {
			self.filterByGenre = genre;
		});
	},
	mounted: function(){
		this.loadMovies(this.productsJsonUrl);
	},
	methods: {
		loadMovies: function(url) {
			var self = this;

			axios.get(url).then(function(response){
				self.movies = response.data;
				bus.$emit("generateGenres", self.movies);
			});
		},
		addToCart: function(event, item) {
			bus.$emit("addToCart", item);
		}
	},
	computed: {
		filteredMovies: function() {
			var self = this;
			bus.$emit("setGenre", self.filterByGenre);

			return this.movies.filter((movie) => {
				return movie.genre.match(self.filterByGenre);
			});
		}
	}
});

Vue.component("app-cart", {
	template: "#vue-app-cart",
	data: function() {
		return {
			cartItems: [],
			total: 0
		}
	},
	created: function(){
		bus.$on("addToCart", this.addToCart);
	},
	methods: {		
		addToCart: function(item) {
			this.cartItems.push(item);
			this.total += parseInt(item.price);
		},
		removeFromCart: function(event, item, key) {
			event.preventDefault;
			this.total -= parseInt(item.price);
			this.cartItems.splice(key, 1);
		},
		checkout: function() {
			alert("Pay €" + this.total + "?");
		}
	},
});

Vue.component("app-genre", {
	template: "#vue-app-genre",
	data: function() {
		return {
			genres: [],
			selected: ''
		}
	},
	created: function() {
		var self = this;

		bus.$on("generateGenres", this.generateGenres);
		bus.$on("setGenre", function(genre){
			self.selected = genre;
		});
	},
	methods: {
		generateGenres: function(data) {
			var genreList = [];

			for(i = 0, j = data.length; i < j; i++){
				genreList.push(data[i].genre);
			}

			var unique = new Map();
			genreList.forEach(d => unique.set(d, d));
			var uniqueItems = [...unique.keys()];		
			
			this.genres = uniqueItems.sort();
		},
		filterMovieList: function(event) {
			bus.$emit("filterGenre", event.target.value);
		}
	}
});

// ---------------------------------------------
// Main instance
// ---------------------------------------------

new Vue({
	el: "#app"	
});

