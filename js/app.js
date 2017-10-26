// ---------------------------------------------
// Bus event mediator
// ---------------------------------------------

var bus = new Vue();

// ---------------------------------------------
// Components
// ---------------------------------------------

Vue.component("app-movie-products", {
	template: "#vue-app-movie-products",
	props: ['filteredMovies'],
	data: function() {
		return {
			filterByGenre: "",
		}
	},
	methods: {
		addToCart: function(event, item) {
			bus.$emit("addToCart", item);
		},
		filterMovieList: function(genre) {
			bus.$emit("filterGenre", genre);
		}
	}	
});

var appPaging = Vue.component("app-pagination", {
	template: "#vue-app-pagination",
	props: ['pagination'],
	data: function() {
		return {
			showPagination: true		
		}
	},
	created: function() {
		var self = this;

		bus.$on("filterGenre", function(genre) {
			if(genre == "") {	
				self.showPagination = true;
			} else {
				self.showPagination = false;
			}
		});
	},
	methods: {
		paginatedMovies: function(index) {
			this.pagination.currentPage = index;
			this.pagination.start = this.pagination.pageIncrementCounter[index];
		},
		prevPage: function() {
			this.pagination.currentPage--;			

			if(this.pagination.currentPage < 0) {
				this.pagination.currentPage = 0;
			}

			this.pagination.start = this.pagination.pageIncrementCounter[this.pagination.currentPage];
		},
		nextPage: function(){
			if(this.pagination.currentPage < (this.pagination.pages -1)) {
				this.pagination.currentPage++;	
				this.pagination.start = this.pagination.pageIncrementCounter[this.pagination.currentPage];
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

var app = new Vue({
	el: "#app",
	data: {
		productsJsonUrl: "json/products.json",
		movies: [],
		filterByGenre: "",
		pagination: {
			pageIncrementCounter: [0],
			currentPage: 0,
			start: 0,
			total: null,		
			increment: 4,
			pages: null
		}
	},
	created: function() {
		var self = this;

		bus.$on("filterGenre", function(genre) {
			self.filterByGenre = genre;
			self.pagination.start = 0;		
			self.pagination.currentPage = 0;
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
				self.pagination.total = response.data.length;
				self.pagination.pages = Math.ceil(response.data.length / self.pagination.increment);
				bus.$emit("generateGenres", self.movies);

				var counter = 0;

				for(i = 1, j = self.pagination.pages; i < j; i++) {
					counter += self.pagination.increment;
					self.pagination.pageIncrementCounter[i] = counter;
				}
			});
		}
	},
	computed: {
		filteredMovies: function() {
			var self = this;
			bus.$emit("setGenre", self.filterByGenre);

			var newList = this.movies.filter((movie) => {
				return movie.genre.match(self.filterByGenre);
			});
			
			var end = self.pagination.start + self.pagination.increment;
			return newList.slice(self.pagination.start, end);
		}
	}
});