import os
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.sys.path.insert(0,parentdir) 
import external
import valid_cities

def test_gmaps(city):
    return external._gmaps_lookup_city(city)

def test_autocomplete():
    return valid_cities.autocomplete_list()


if __name__ == "__main__":
    #print(test_gmaps("Mexico City"))
    print(test_autocomplete())
