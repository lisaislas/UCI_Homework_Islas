from flask import Flask, render_template, redirect, jsonify
import pymongo
import scrape_mars

app = Flask(__name__)
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# route
@app.route("/")
def index():
    mars = client.db.mars.find_one()
    return render_template("index.html", mars=mars)
    
@app.route("/scrape")
def scrape():

    # Run the scrape function
    mars = client.db.mars
    mars_data = scrape_mars.scrape()

    # Update the Mongo database using update and upsert=True
    mars.update({}, mars_data, upsert=True)

    # Redirect back to home page
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)