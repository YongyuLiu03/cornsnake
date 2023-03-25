# Corn Snake Morphs Handbook

## Overview

__Corn snakes__ are some of the best pet snakes. The are doctile, don't mind being handled, and come in a variety of truly beaeutiful colors thanks to gene mutation and expression. In fact corn snake colarations (usually referred to as __morphs__) are so varied and prized that hobbyists and breeders have dedicated their lives to acquiting and breeding these snakes into over 900 recognized morphs. 

For those curious and interested in raising a corn snake, selecting from an unlimited collection of colors and patterns could be overwhelming. This handbook, documented with some of the most notable and popular morphs, allow you to navigate with filter, add your favorite morphs into collection with an account, as well as view the popularity ranking calculated from all uses's collections.

## Data Model

Note that although there are over 900 corn snake morphs, there are only 5 wild-type genetic strains and 28 selected gene traits. Most of the morphs can be mada from combining these strains into double, triple, and all the way up to six traits. 

The application will store users, morphs, and traits.

* Each user can have one collection, an array of morphs (via reference)
* Each morph can have multiple traits (by embedding)

An Example User:
```javascript
{
  username: "foo",
  hash: // a password hash,
  collection: // an array of references to Morph object
}
```

An Example Morph:
```javascript
{
  name: "Fire Stripe",
  type: 3,
  traits: ["Amelanistic", "Diffused", "Stripe"],
  hatchlingImg: ,
  adultImg: ,
  hits: 10 // number of users that add it into collection
}
```

types dictionary:
```javascript
{
  0: "Wildtypes",
  1: "Single Recessive",
  2: "Double Trait",
  3: "Triple Trait",
  4: "Quad Trait",
  5: "Five Trait",
  6: "Six Trait",
  7: "Singe Dominant",
  9: "Selectively Bred"
}
```

traits dictionary:
```javascript
{
  wildtype: 
    ['Alabama', 'Keys', 'Miami', 'Normal', 'Okeetee'], 
  recessive: 
    ['Lavender', 'Microscale', 'Motley', 'Red Coat', 'Scaleless', 'Strawberry', 'Stripe', 'Sunkissed', 'Sunrise', 'Terrazzo', 'Ultra', 'Amelanistic', 'Anerythristic', 'Caramel', 'Charcoal', 'Christmas', 'Cinder', 'Diffused', 'Dilute', 'Hypomelanistic', 'Kastanie', 'Lava'], 
  dominant: 
    ['Het Palmetto', 'Palmetto', 'Buf', 'Masque', 'Tessera', 'Caramel']
}
```

## [Link to Commented First Draft Schema](db.mjs) 

## Wireframes

/home - page shown first when user visit
![list create](documentation/home.jpg)

/about - page for showing overview for the web app
![list create](documentation/about.jpg)

/morphs - page for showing all morphs
![list create](documentation/morphs.jpg)

/rank - page for showing top ranking morphs
![list create](documentation/rank.jpg)

/mine - page for showing users's collection 
![list create](documentation/mine.jpg)

## Site map

![site map](documentation/sitemap.jpg)

## User Stories or Use Cases

(__TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://en.wikipedia.org/wiki/Use_case))

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new grocery list
4. as a user, I can view all of the grocery lists I've created in a single list
5. as a user, I can add items to an existing grocery list
6. as a user, I can cross off items in an existing grocery list

## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed)

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (5 points) vue.js
    * used vue.js as the frontend framework; it's a challenging library to learn, so I've assigned it 5 points

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit)


## [Link to Initial Main Project File](app.mjs) 

(__TODO__: create a skeleton Express application with a package.json, app.mjs, views folder, etc. ... and link to your initial app.mjs)

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)

