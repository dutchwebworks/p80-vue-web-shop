# Poort80 Vue Web Shop demo project

*By Dennis Burger, Poort80 Amsterdam, november 2017*

This is a VueJS / JavaScript based demo web shop.

## Prerequisites

Make sure the following is installed in order to run this demo on your local machine.

* [NodeJS](https://nodejs.org/)
* [GruntJS](https://gruntjs.com/)

## Project setup

Using Grunt and Sass. First do a regular old NPM install (or use `yarn`) inside this directory.

```bash
npm install
```
    
After that run the **default Grunt task** to spin up a (browser-sync) web server which starts the VueJS web app. demo project.

```bash
grunt
```

### CORS

For the **correct working of the zip-code address lookup** (during checkout) you'll need a web server that has **CORS** (Cross-Origin Resource Sharing) **enabled**. This will make sure the Postcode API doesn't send the `Access-Control-Allow-Origin` -header error. If you have `browser-sync` installed globally (using `npm install -g browser-sync`) you can run the following from the root of this demo project directory:

```bash
browser-sync start --server --cors --files="css/*.css, **/*.html"
```

## Features

Using **VueJS**, vanilla JavaScript, **Axios** (a promise based Ajax loader), (a tiny bit of) Zepto (jQuery alternative), **VeeValidate** (form validation) and **MagnificPopup** this simple web shop uses the following features:

* Build using VueJS and uses separate **Vue components** that talk to each other using VueJS event emitters and listners.
* Ajax loaders.
* **External data** is loaded using Axios promise based Ajax loader.
* Clicking on the movie product poster opens a **movie trailer popup**.
* Prices have a **NL locale format** via VueJS filters. JSON data contains floating numbers.
* Sidebar shopping cart:
	* Add products.
	* Remove products.
	* Price total (re)calculation.
* **Filtering of movie products**. Click in sidebar catagory filter or on the movie product category label.
* **Dynamic paging** of the movie product list.
* Checkout page:
	* User information form.
	* Basic **form validation using VueJS VeeValidate**.
	* Adding optional **coupon codes** (loaded in via Ajax) with price (re)calculation).
	* **Search for address info using a (Dutch) postalcode lookup API**.
	* Display a **static Google Map image** of the found address.
	* Sending the user form as a JSON object using Ajax. Show JSON object in sidebar.
	* Based on response and a check show a 'thank you' -block.  Show JSON object in sidebar.
* Layout of this web page is done with legacy- and modern **CSS Grid**. This demo web site is not responsive.

## Web browser support

Because this is a demo project and it uses some ES6 promises, mainly Axios library for Ajax calls, and some ES6 arrow functions it will run in following web browsers:

* Chrome (desktop & Android).
* Firefox.
* Safari (macOS & iOS).
* Win/Edge.
* Opera.

*No support for old Win/IE*.

## Resources

* [VueJS.org](https://vuejs.org)
* [Axios](https://github.com/axios/axios)
* [VeeValidate](http://vee-validate.logaretm.com/)
* [Sass-lang.com](http://sass-lang.com)
* [Dennis Burger, Poort80](mailto:dennis.burger@poort80.nl)