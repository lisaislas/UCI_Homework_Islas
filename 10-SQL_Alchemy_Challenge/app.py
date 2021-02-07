# Import dependencies

import sqlalchemy
import numpy as np
import datetime as dt

from flask import Flask, jsonify
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

# Create engine
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Set up flask and create an app
app = Flask(__name__)

# Define flask routes for when the user is on home page
@app.route("/")
def home():
    """List all available API routes"""
    return(
        f"Available Routes: <br/>"
        f"Precipitation: /api/v1.0/precipitation<br/>"
        f"List of stations: /api/v1.0/stations<br/>"
        f"One year temp observations: /api/v1.0/tobs<br/>"
        f"Temperature data from start date(yyyy-mm-dd format): /api/v1.0/<start><br/>"
        f"Temperature data from start to end dates(yyyy-mm-dd/yyyy-mm-dd format): /api/v1.0/<start>/<end><br/>"
    )

# Create precipitation route
@app.route("/api/v1.0/precipitation")
def precipitation():
    # Create a session link from python to the db
    session = Session(engine)
    # Create query
    results = session.query(Measurement.date, Measurement.prcp).all()
    # Close session
    session.close()

    precipitation_list = []
    for date, prcp in results:
        rain_dict = {}
        rain_dict['Date'] = date
        rain_dict['Precipitation'] = prcp
        precipitation_list.append(rain_dict)
    
    return jsonify(precipitation_list)


@app.route("/api/v1.0/stations")
def stations():
    session = Session(engine)
    results = session.query(Station.station, Station.name).all()
    session.close()

    station_list = []
    for station, name in results:
        station_dict = {}
        station_dict['Station'] = station
        station_dict['Name'] = name
        station_list.append(station_dict)

    return jsonify(station_list)


@app.route("/api/v1.0/tobs")
def tobs():
    session = Session(engine)
    query_date = dt.date(2017,8,23) - dt.timedelta(days=365)
    results = session.query(Measurement.tobs, Measurement.date).filter(Measurement.date >= query_date).all()
    session.close()

    tobs_list = []
    for date, tobs in results:
        tobs_dict = {}
        tobs_dict['Date'] = date
        tobs_dict['tobs'] = tobs
        tobs_list.append(tobs_dict)

    return jsonify(tobs_list)


@app.route("/api/v1.0/<start_date>")
def start(start_date):
    session = Session(engine)
    starts = dt.datetime.strptime(start_date, '%Y-%m-%d')
    # Return the min, max, and avg temps for a given start date 
    results = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
    filter(Measurement.date >= starts).all()
    session.close()

    temp_list = []
    for min, avg, max in results:
        temp_dict = {}
        temp_dict['min temp'] = min
        temp_dict['avg temp'] = avg
        temp_dict['max temp'] = max
        temp_list.append(temp_dict)

    return jsonify(temp_list)


@app.route("/api/v1.0/<start>/<end>")
def start_end(start, end):
    session = Session(engine)
    start_date = dt.datetime.strptime(start, '%Y-%m-%d')
    end_date = dt.datetime.strptime(end, '%Y-%m-%d')
    results = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
    filter(Measurement.date >= start_date).filter(Measurement.date <= end_date)

    temp_list_se = []
    for min, avg, max in results:
        temp_dict_se = {}
        temp_dict_se['min temp'] = min
        temp_dict_se['avg temp'] = avg
        temp_dict_se['max temp'] = max
        temp_list_se.append(temp_dict_se)

    return jsonify(temp_list_se)


if __name__ == "__main__":
    app.run(debug=True)