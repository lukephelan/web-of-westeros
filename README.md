### Game of Thrones Interactive Family Tree

## Choosing Technology

### Database for Genealogy

Initially I was intending on creating the application on the MEAN stack,
utilising MongoDB as the database. I did a quick search for creating a
genealogy database with MongoDB and NoSQL in general, and came across the
following [slideshow](http://www.slideshare.net/spf13/mongodb-for-genealogy).

At first it may seem that a traditional relational database like SQL would make
the most sense for genealogy given the inherent nature of the relationships,
however as shown in the above slideshow, family trees are a lot more
unconventional than they may first appear.

For example, people change their names, birth dates can be unclear,
relationships change over time, people adopt children and have illegitimate
children, and in the case of Game of Thrones, people can be resurrected! A
NoSQL database allows more flexibility in the nature of the data that you would
store for an individual.

Pretty quickly however I came across the [graph database](https://en.wikipedia.org/wiki/Graph_database),
specifically, [Neo4j](https://neo4j.com/).

I spent an afternoon playing around with Neo4j and after spending a few hours
away from the computer I couldn't stop thinking about how perfect it was for
my application, and how little sense it made for me to try anything else.

If you need a database that relies heavily on relationships and needs the
flexibility of NoSQL, I would recommend checking it out. But I wouldn't try to
use it unless it makes more sense than any of the alternatives.

The best part is that Neo4j comes with a browser interface which graphically
displays your data.

![alt text](./images/neo4j-screenshot1.png)

### Visualisation

Of course, upon seeing this amazing visualisation - one in which you can click
nodes, drag them around and watch them wobble - I wanted the same for my
application. The problem is there is no easy way to do this. One option is to
look at the source code for Neo4j but unfortunately I am not quite there yet.

So instead I went through the list of technology recommended by Neo4j and
played around with a few tools and looked at how a few other people on the web
had displayed their data.

The best example I found was [this one](http://jexp.github.io/cy2neo/). There
is a hell of a lot of code there however, and I think most of it was taken
directly from the source code from Neo4j. So it looks great, but would be
incredibly difficult for me to customise for my application. Also, I didn't
feel overly comfortable putting my name on such a large chunk of copy-pasted
code.

I settled on [Sigma.js](http://sigmajs.org/). It comes with preset plug-ins and
a bunch of examples with which to work with, one of which works with data with
Neo4j. Unfortunately (but a blessing in disguise), it was also the plainest of
all the examples. Therefore, I had to dig in to the code to customise it to my
will.

### The Game of Thrones Wikia API

I want to get my extended information from the [Game of Thrones Wikia
API.](http://gameofthrones.wikia.com/wiki/Game_of_Thrones_Wiki)

An example of a query on information about Jon Snow:

http://gameofthrones.wikia.com/api/v1/Articles/AsSimpleJson?id=2123

This lays out all the articles from the Jon Snow biography page, but does not
capture information such as that we want to store in the database.

## Loading the Database

Download Neo4j, then copy and paste the code from [got-tree]('/got-tree') into
the command line to seed the database.

## Problems

- Learning Neo4j
- Figuring out how to seed the database properly (link to that seed file)
- Visualising the data (a few links here)
- Getting the JSON output to be in the format I wanted
- Parsing the JSON into the front ends
