from city_types import Location
import external


"""
The City class represents all the information that is known about a city
including its name and geographic location. It includes methods for retrieving
additional information through external APIs and caches the results of those
API calls when appropriate.
"""
class City:
    def __init__(self, name, country, location):
        self.name = name
        self.country = country
        self.location = location
        self._weather_json = None
        self._wiki_json = None
        self._gmaps_json = None

    def __str__(self):
        return "City(" + repr(self.name) + \
                ", " + repr(self.country) + \
                ", " + str(self.location) + ")"

    def to_json(self):
        return {
            'name': self.name,
            'country': self.country,
            'location': {
                'lat': self.location.lat,
                'lng': self.location.lng,
            }
        }

    """
    Get a JSON object containing weather information. The first time
    this method is called, the object is retrieved with an external API
    call and then stored for future calls.
    """
    def get_weather_json(self):
        if self._weather_json is None:
            self._weather_json = external._lookup_weather(self.location)

        return self._weather_json

    """
    Get a JSON object containing information from Wikipedia. The first time
    this method is called, the object is retrieved with an external API
    call and then stored for future calls.
    """
    def get_wikipedia_json(self):
        if self._wiki_json is None:
            self._wiki_json = external._lookup_wikipedia(self.name)

        return self._wiki_json

    """
    Get a JSON object containing information from the New York Times.
    """
    def get_news_json(self):
        # Note: The news is not cached because we want the most recent
        #       headlines.

        return external._lookup_nyt(self.name)

    """ 
    Get a TimeInfo object for the current time in the city.
    """
    def get_time(self):
        # Note: The time info is not cached because the local time may have
        #       changed since the previous call

        return external._lookup_time(self.location)


    """
    Use an external API call to create a new City object. The resulting object
    will have a stored name and location, and can be used to retrieve more
    information through additional API calls.

    Returns None if no matching city was found.
    """
    @classmethod
    def lookup(cls, query):
        city_json = external._gmaps_lookup_city(query)       

        if city_json is None:
            return None

        address_components = city_json['address_components']
        city_name = address_components[0]['short_name']

        country_name = None
        for c in address_components:
            c_type = c['types'][0]
            if c_type == 'country':
                country_name = c['long_name']

        loc_json = city_json['geometry']['location']
        location = Location(loc_json['lat'], loc_json['lng'])

        return cls(city_name, country_name, location)


# If this is the main module, load an example city
# This can be used for interactive testing, e.g.:
#
#   > python -i city.py
#
# After running the above command, you should be in the python interpretter
# with a global 'city' variable that contains an example city.
if __name__ == '__main__':
    global city
    city = City.lookup("New York")
