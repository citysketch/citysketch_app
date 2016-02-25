### This module contains city lists

import json

def autocomplete_list():
    auto_list = []
    # Source: https://github.com/mahemoff/geodata
    json_file = json.loads(open('resources/cities.json').read())
    for i in range(len(json_file)):
        auto_list.append(json_file.values()[i]['city'])
    auto_list.sort()
    return auto_list

# list of tested cities
tested_list = ['Seoul', 'Delhi', 'Shanghai',
            'New York', 'Sao Paulo', 'Mexico City', 'Cairo',
            'Beijing', 'Osaka', 'Mumbai', 'Guangzhou', 'Moscow',
            'Los Angeles', 'Calcutta', 'Dhaka', 'Buenos Aires', 'Istanbul',
            'Rio de Janeiro', 'Shenzhen', 'Paris', 'Nagoya',
            'Lima', 'Chicago', 'Kinshasa', 'Tianjin', 'Chennai']

twitter_ban = ['Manila', 'Abuja']
