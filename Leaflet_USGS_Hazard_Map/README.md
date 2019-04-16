# USGS Earthquakes Hazard Map

![alt text](https://raw.githubusercontent.com/Donthave1/USGS-Earthquakes-Hazard-Map/master/static/images/1-Logo.png "logo")

## Objective
The USGS provides earthquake data in a number of different formats, updated every 5 minutes. 
![alt text](https://raw.githubusercontent.com/Donthave1/USGS-Earthquakes-Hazard-Map/master/static/images/6-Time_Keeps_On_Ticking.gif "update-map")

Visit the [USGS GeoJSON Feed page](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) and pick the past 7-days data set to visualize. USGS website provided a [JSON representation](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson) of that data.

Tools:

* JavaScript, Leaflet.js, D3.js, HTML, CSS, Boostrap

### Please click on the link below to check out data visualization of the past 7 days for Earthquakes Hazard Map:
[USGS Earthquakes Hazard Map](https://donthave1.github.io/USGS-Earthquakes-Hazard-Map/)


![alt text](https://raw.githubusercontent.com/Donthave1/USGS-Earthquakes-Hazard-Map/master/static/images/5-Advanced.png "final")

I created a map using Leaflet that plots all of the earthquakes from the past 7-days data set based on USGS site provided longitude and latitude.
Each data markers reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes will appear larger in size and darker in color.
I include popups features that will provide additional information about the earthquake when a marker is c licked, and a legend was added to display context for viewer.

In addition, I plot a second data set on the map to illustrate the relationship between tectonic plates and seismic activity.  
Data on tectonic plates can be found at [here](https://github.com/fraxen/tectonicplates).

Finally, I also added a few different version of base maps to choose from and viewer can toggle it independently using the control on the top right corner.


