### This module contains city tested list

import json


"""
Produce a sorted list of known city names.
This function is expensive the first time it is called.
"""
def autocomplete_list():
    global _cached_autocomplete_list

    if _cached_autocomplete_list is None:
        _cached_autocomplete_list = _build_autocomplete_list()

    return _cached_autocomplete_list


"""
The list of cities that are known to have working city pages.
"""
tested_list = ['Antwerp', 'Atlanta', 'Austin',
               'Berlin', 'Boston', 'Brussels',
               'Calgary', 'Canberra', 'Chicago',
               'Dallas', 'Denver', 'Doha', 'Dublin', 
               'Hamburg', 'Helsinki', 'Honolulu', 'Houston',
               'Lima', 'Lisbon', 'London', 
               'Madrid',
               'New York',
               'Paris', 'Phoenix', 'Prague',
               'Rabat', 'Riyadh', 'Rome', 'Rotterdam',
               'San Francisco', 'San Diego', 'Seattle' ,'Seville', 'Stockholm', 
               'Toronto', 
               'Valencia', 'Vienna',
               'Warsaw',
               'Yokohama',
               'Zagreb']


_cached_autocomplete_list = None


# Build the city autocompletion list. This is somewhat expensive because it
# must parse a JSON file containing hundreds of city objects.
def _build_autocomplete_list():
    auto_list = []
    # Source: https://github.com/mahemoff/geodata
    json_file = json.loads(open('resources/cities.json').read())
    for i in range(len(json_file)):
        auto_list.append(json_file.values()[i]['city'])
    auto_list.sort()
    return auto_list
