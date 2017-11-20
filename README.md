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


* Use of **Vue components**.
* **Pagination** using **Vue computed properties**.
* A simple cart with **add and remove products** and **(re)calculating** cart total.
* Movie genre **filtering** using Vue computed properties.
* Basic popup showing the **movie trailer** (MagnficiPopup).
* Basic 'checkout' -page with an **user details form**.
* Form validation and handling using **VueJS VeeValidate** (plugin) on different types of form fields.
* Basic **coupon** entering / check system with (re)calculating the total.
* **Address lookup based on zip-code and housenumber**.
* **Generating static Google Maps** based on found zip-code / housenumber **GPS-data**.
* Sending a **post json** request to a fake server. And receiving a fake answer.
* The data for movie products, coupon codes and fake server response is **loaded via Ajax (Axios) and json files**.
* Basic usage of both (Win/IE, Edge) legacy and modern W3C **CSS Grid layout**.

## Web browser support

Because this is a demo project and it uses some ES6 promises, mainly Axios library for Ajax calls, and some ES6 arrow functions it will run in web browsers like:

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