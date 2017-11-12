// ---------------------------------------------
// Bus event mediator
// ---------------------------------------------

var bus = new Vue({
	data: {
		// cartItems: []
	}
});

// ---------------------------------------------
// Components
// ---------------------------------------------

Vue.component("app-loading", {
	template: "#vue-app-loading"
});

Vue.component("app-shop", {
	template: "#vue-app-shop",
	data: function() {
		return {
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

			self.pagination.total = newList.length;
			self.pagination.pages = Math.ceil(newList.length / self.pagination.increment);
			
			var end = self.pagination.start + self.pagination.increment;
			return newList.slice(self.pagination.start, end);
		}
	}
});

Vue.component("app-genre", {
	template: "#vue-app-genre",
	props: ['total'],
	data: function() {
		return {
			genres: [],
			selected: '',
			isActiveClass: 'is-active'
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
				genreList.push({
					genre: data[i].genre,
					count: 1
				});
			}

			var map = genreList.reduce(function(map, value) {
				var genre = value.genre;
				var count = +value.count;
				map[genre] = (map[genre] || 0) + count
					return map
				}, 
			{});

			var array = Object.keys(map).map(function(genre) {
				return {
					genre: genre,
					count: map[genre]
				}
			});

			array.sort(function(a, b){
				return a.genre > b.genre;
			});
			
			this.genres = array;
		},
		filterMovieList: function(element) {
			bus.$emit("filterGenre", element.currentTarget.value);
		}
	}
});

Vue.component("app-pagination", {
	template: "#vue-app-pagination",
	props: ['pagination'],
	data: function() {
		return {
			showPagination: true		
		}
	},
	created: function() {
		var self = this;
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

Vue.component("app-cart", {
	template: "#vue-app-cart",
	data: function() {
		return {
			cartItems: [],
			total: 0
		}
	},
	created: function(){
		if(bus.cartItems != undefined && bus.cartItems.length > 0) {
			this.cartItems = bus.cartItems;
			this.total = bus.total;
		}

		bus.$on("addToCart", this.addToCart);
	},
	methods: {
		addToCart: function(item) {
			this.cartItems.push(item);
			this.total += item.price;
		},
		removeFromCart: function(event, item, key) {
			this.total -= parseInt(item.price);
			this.cartItems.splice(key, 1);
		},
		emptyCart: function(){
			var confirmEmpty = confirm("Remove all " + this.cartItems.length + " items?");

			if(confirmEmpty == true) {
				this.cartItems = [];
				this.total = 0;				
			}
		},
		checkout: function() {
			bus.cartItems = this.cartItems;		
			bus.total = this.total;
			bus.$emit("switchComponent", "app-checkout");
		}
	},
});

Vue.component("app-checkout", {
	template: "#vue-app-checkout",
	data: function() {
		return {
			showJson: false,
			agreedToTerms: false,
			cartItemIds: [],
			coupon: {
				url: "/json/coupon-codes.json",
				items: [],
				user: '',
				couponDone: false,
				successMessage: "Coupon used: ",
				errorMessage: "Coupon code is incorrect",
				message: '',
				classname: '',
				classnameCorrect: 'is-correct',
				classnameInCorrect: 'is-incorrect'
			},
			userData: {
				cartItemIds: [],
				total: null,
				firstname: '',
				lastname: '',
				email: '',
				newsletters: [],
				bank: '',
				creditcard: '',
			},
			payment: {
				banks: [
					{ name: 'ING', value: 'ing' },
					{ name: 'Rabobank', value: 'rabobank' },
					{ name: 'ABN-Amro', value: 'abnamro' },
					{ name: 'SNS', value: 'sns' },
					{ name: 'ASN', value: 'asn' }
				],
				creditcards: [
					{ name: 'Mastercard', value: 'mastercard' },
					{ name: 'Visa', value: 'visa' },
					{ name: 'Pay-Pal', value: 'paypal' }
				]
			}
		}
	},
	created: function() {
		for(i = 0, j = bus.cartItems.length; i < j; i++) {
			this.userData.cartItemIds.push(parseInt(bus.cartItems[i].id));
		}

		this.cartItems = bus.cartItems;
		this.userData.total = bus.total;

		this.getCoupons(this.coupon.url);
	},
	mounted: function() {

	},
	methods: {
		getCoupons: function(url) {
			var self = this;

			axios.get(url).then(function(response){
				self.coupon.items = response.data;
			});
		},
		validateCouponCode: function(coupon) {
			for(i = 0, j = this.coupon.items.length; i < j; i++) {
				if(this.coupon.items[i].code == coupon) {
					return this.coupon.items[i];
				}
			}
		},
		checkCouponCode: function() {
			var userCoupon = this.validateCouponCode(this.coupon.user);

			if(typeof(userCoupon) == "object") {
				this.coupon.message = this.coupon.successMessage + userCoupon.name + " discount: " + userCoupon.discount;
				this.coupon.classname = this.coupon.classnameCorrect;
				this.coupon.couponDone = true;
			} else {
				this.coupon.message = this.coupon.errorMessage;
				this.coupon.classname = this.coupon.classnameInCorrect;
			}
		},
		backToShop: function() {
			bus.$emit("switchComponent", "app-shop");
		},
		validateBeforeSubmit: function() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.showJson = true;

					axios.post('/order-products', this.userData)
						.then(function (response) {
							console.log(response);
						})
						.catch(function (error) {
							console.log(error);
						});
				}
			});			
		}
	},
	computed: {
		paymentMethod: function() {
			if(this.userData.paymentMethod == "ideal") {
				this.userData.creditcard = '';
			} else if(this.userData.paymentMethod == "creditcard") {
				this.userData.bank = '';
			}
		}
	}
});

Vue.component("app-footer", {
	template: "#vue-app-footer"
});

// ---------------------------------------------
// Main instance
// ---------------------------------------------

new Vue({
	el: "#vue-app",
	data: {
		selectedComponent: "app-shop",
	},
	created: function() {
		var self = this;
		bus.$on("switchComponent", function(name){
			self.selectedComponent = name;
		});
	}
});

// ---------------------------------------------
// Globlal filters
// ---------------------------------------------

Vue.filter("capitalizeFirstLetter", function(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
});

// ---------------------------------------------
// Vee Validate
// ---------------------------------------------

Vue.use(VeeValidate);