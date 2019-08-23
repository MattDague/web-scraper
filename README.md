# MongoDB Web-Scraper

Welcome to the MongoDB IndieWire Web Scraper! I created this app with the simple purpose of capturing information on the latest movies new from IndieWire. When using this app you are able to grab the latest news articles, saved your favorites and even comment on them. This functionality is all supported with primarily the help of Cheerio and MongoDB.

# How It Works

When the app is started the main page immediately does an ajax call to the mongoDB to see if there are any articles already scraped. If there are not any visible the user should then click the "Scrape New Articles" button at the top to be presented with some of the latest articles from IndieWire regarding movie news. After the button is clicked it uses Cheerio to scraped targeted information from the website and save it to a MongoDB collection. Then the page reloads and an express get method is used to retrieve the saved information from the DB. Then for each article that is found, it is passed through handlebars which generates a container for each which displays the title, summary, picture, save button and comment button. Each button is given the data-_id attribute of the article in the database, it uses this information later to target the article in the database.

If the save button is clicked the article updated using a post method which targets the information in the database. When an article is "saved" the saved key in the database is updated to "true" (its false by default). Once an article is saved if the user clicks the saved articles button at the top they will be presented with all articles that have saved set to "true". This process is similar to the full display of articles expect when pass through handlebars these are given a "remove" button. This button does the exact opposite of saved but through the same process, it sets the saved key back to "false" and it therefore will no longer show up as saved.

If the user wishes to leave a comment they also have that choice next to each article. Clicking this causes a dynamically generated modal display over everything else in the screen. This modal first does a call to the db to check if there are any comments associated to the article. If so they are displayed within the modal above ithe input text fields with a delete button alongside it. This button is given the comments objectId so that when clicked a call to the databse is made to removed the comment from the db. The user can leave their own comments here as well. When information is entered to the text field they can click the save comment button. When clicked this button generates a comment using the comment model. Then this comment is saved to the database, and it updates the articles in the database. The call is done so that the comment is saved within the article object. This attaches the two and this information is how another users comment is displayed when an article is clicked to be commented on.

The last option the user really has is to clear the articles. When this button is clicked the collection is simply dropped from the database. To generate new articles the user must scrape again!

# Technologies Used


- MongoDB
- Cheerio
- MongoJS
- Mongoose
- JavaScript
- Express
- Node
- Heroku
- Handlebars
- Axios

