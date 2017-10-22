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
			filterByGenre: '',
			pagination: {
				start: 0,
				nrOfItems: null,		
				increment: 5,
				nrOfPages: null
			}
		}
	},
	created: function() {
		var self = this;
		bus.$on("filterGenre", function(genre) {
			self.filterByGenre = genre;
			self.pagination.start = 0;
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
				self.pagination.nrOfItems = response.data.length;
				self.pagination.nrOfPages = Math.ceil(response.data.length / self.pagination.increment);
				bus.$emit("generateGenres", self.movies);
			});
		},
		addToCart: function(event, item) {
			bus.$emit("addToCart", item);
		},
		paginatedMovies: function(index) {
			this.pagination.start = index;
		},
		getPagination: function(totalItemsCount, numberOfItemsPerPage, page) {
			var pagesCount = (totalItemsCount - 1) / numberOfItemsPerPage + 1;
			var start = (page - 1) * numberOfItemsPerPage + 1;
			var end = Math.min(start + numberOfItemsPerPage - 1, totalItemsCount);
			
			return {
				start: start,
				end: end,
				total: totalItemsCount
			}
		}
	},
	computed: {
		filteredMovies: function() {
			var self = this;
			bus.$emit("setGenre", self.filterByGenre);

			var newList = this.movies.filter((movie) => {
				return movie.genre.match(self.filterByGenre);
			});

			var sliced = this.getPagination(this.pagination.nrOfItems, this.pagination.increment, this.pagination.start);
			console.log(sliced.start, sliced.end);

			if(this.pagination.start > 0) {
				return newList.slice(sliced.start, sliced.end);
			} else {
				return newList;
			}
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
		emptyCart: function(){
			var confirmEmpty = confirm("Empty basket?");

			if(confirmEmpty == true) {
				this.cartItems = [];
				this.total = 0;				
			}
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
		filterMovieList: function(element) {
			bus.$emit("filterGenre", element.currentTarget.value);
		}
	}
});

// ---------------------------------------------
// Globlal filters
// ---------------------------------------------

Vue.filter("capitalizeFirstLetter", function(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
});

// ---------------------------------------------
// Main instance
// ---------------------------------------------

new Vue({
	el: "#app"	
});

