import os
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.sys.path.insert(0,parentdir)
import oauth2
import datetime

import email_support
import external
import valid_cities
from index import app
from sensitive_text import sensitive_text
from city_desc import get_city_description
from twitter import get_twitter

def test_gmaps():
    city = "Mexico City"
    test = False
    try:
        response = external._gmaps_lookup_city(city)
        address_types = response['address_components'][0]['types']
        if (address_types[0] == 'locality' and address_types[1] == 'political'):
            test = True
            city = response['address_components'][0]['long_name']
    except:
        pass
    assert(test == True and city == "Mexico City") # test_gmaps test 1
    
    city = "asdfdafasd"
    test = False
    try:
        response = external._gmaps_lookup_city(city)
        address_types = response['address_components'][0]['types']
        if (address_types[0] == 'locality' and address_types[1] == 'political'):
            test = True
            city = response['address_components'][0]['long_name']
    except:
        pass
    assert(test == False) # test_gmaps test 2

    city = "San Fran"
    test = False
    try:
        response = external._gmaps_lookup_city(city)
        address_types = response['address_components'][0]['types']
        if (address_types[0] == 'locality' and address_types[1] == 'political'):
            test = True
            city = response['address_components'][0]['long_name']
    except:
        pass
    assert(test == True and city == "San Francisco") # test_gmaps test 3

    city = "New York City"
    test = False
    try:
        response = external._gmaps_lookup_city(city)
        address_types = response['address_components'][0]['types']
        if (address_types[0] == 'locality' and address_types[1] == 'political'):
            test = True
            city = response['address_components'][0]['long_name']
    except:
        pass
    assert(test == True and city == "New York") # test_gmaps test 4

    city = "NYC"
    test = False
    try:
        response = external._gmaps_lookup_city(city)
        address_types = response['address_components'][0]['types']
        if (address_types[0] == 'locality' and address_types[1] == 'political'):
            test = True
            city = response['address_components'][0]['long_name']
    except:
        pass
    assert(test == True and city == "New York") # test_gmaps test 5


def test_autocomplete():
    count = len(valid_cities.autocomplete_list())
    assert(count > 100) # test_autocomplete test 1
    assert(valid_cities._cached_autocomplete_list != None) # test_autocomplete test 2


def test_city_desc():
    response = get_city_description("New York", "United States")
    assert((response['url'] != None and response['title'] != None and \
           response['text'] != None) == True) # test_city_desc test #1
    response = get_city_description("Paris", "France")
    assert((response['url'] != None and response['title'] != None and \
           response['text'] != None) == True) # test_city_desc test #1


def test_sensitive_text():
    input_text = 'Car, is; better*than\nugly#car#bus1'
    assert(sensitive_text(input_text) == False) # "test_sensitive_text test 1"
    input_text = 'sadfsdaf, is; betsdfasfter*than\sex#car#bus2'
    assert(sensitive_text(input_text) == True) # "test_sensitive_text test 2"
    input_text = 'asdfasdf, is; bettasdfer*than.ass#car#bus3'
    assert(sensitive_text(input_text) == True) # "test_sensitive_text test 3"
    input_text = 'asdfdfs, is; betasdfter*than.any#ass#bus4'
    assert(sensitive_text(input_text) == True) # "test_sensitive_text test 4"
    input_text = 'sfasfsdfdsaf, is; besdftter*than.any# ass#bus5'
    assert(sensitive_text(input_text) == True) # "test_sensitive_text test 5"
    input_text = 'Be, is; better*thsfan.any#   ass #bus6'
    assert(sensitive_text(input_text) == True) # "test_sensitive_text test 6"
    input_text = 'Basdf, is; ?ass?bettsadfer*than.any#   ok #bus7'
    assert(sensitive_text(input_text) == True) # "test_sensitive_text test 7"
    input_text = 'Basdfsdaf, is; @ass?besafdtter*than.any#   ok #bus8'
    assert(sensitive_text(input_text) == True) # "test_sensitive_text test 8"
    input_text = '#  #'
    assert(sensitive_text(input_text) == False) # "test_sensitive_text test 9"
    input_text = 'Basdfsdaf, is; @mas?besafdtter*massage.any#   ok #bus8'
    assert(sensitive_text(input_text) == True) # "test_sensitive_text test 8"


def test_twitter():
    class loc(object):
        pass
    loc.lat = '37.7833'
    loc.lng = '-122.4167'
    response = get_twitter("San Francisco", loc)
    date = response[0][0]['date']
    text = response[0][1]['text']
    assert((date != None and text != None) == True) # "test_twitter test 1"

    loc.lat = '40.7127'
    loc.lng = '-74.0059'
    response = get_twitter("New York", loc)
    date = response[0][0]['date']
    text = response[0][1]['text']
    assert((date != None and text != None) == True) # "test_twitter test 2"


def test_weather():
    class loc(object):
        pass
    loc.lat = '37.7833'
    loc.lng = '-122.4167'
    response = external._lookup_weather(loc)
    name = response['city']['name']
    assert(name == "San Francisco") # test_weather 1

    loc.lat = '40.7127'
    loc.lng = '-74.0059'
    response = external._lookup_weather(loc)
    name = response['city']['name']
    assert(name == "New York") # test_weather 2


def test_wiki():
    response = external._lookup_wikipedia("New York", country_name = "United States")
    assert(response[1][1] == "New York City") # test_wiki 1
    response = external._lookup_wikipedia("New York", country_name = False)
    assert(response[1][1] == "New York City") # test_wiki 2
    response = external._lookup_wikipedia("Boston", country_name = "United States")
    assert(response[1][0] == "Boston") # test_wiki 3


def test_nyt():
    response = external._lookup_nyt("New York", country_name = "United States")
    assert(response['status'] == 'OK') # test_nyt 1
    

def test_time():
    class loc(object):
        pass
    loc.lat = '37.7833'
    loc.lng = '-122.4167'
    response = external._lookup_time(loc)
    local = datetime.datetime.now() - datetime.timedelta(hours=8)
    hour = local.hour if local.hour < 12 else local.hour - 12
    hour = str(hour) if hour > 9 else '0' + str(hour)
    min = str(local.minute) if local.minute > 9 else '0' + str(local.minute)
    flag = "AM" if local.hour < 12 else "PM"
    expected_time = hour + ':' + min + ' ' + flag
    assert(expected_time == response.as_string()) # test_time 1
    
    loc.lat = '40.7127'
    loc.lng = '-74.0059'
    response = external._lookup_time(loc)
    local = datetime.datetime.now() - datetime.timedelta(hours=5)
    hour = local.hour if local.hour < 12 else local.hour - 12
    hour = str(hour) if hour > 9 else '0' + str(hour)
    min = str(local.minute) if local.minute > 9 else '0' + str(local.minute)
    flag = "AM" if local.hour < 12 else "PM"
    expected_time = hour + ':' + min + ' ' + flag
    assert(expected_time == response.as_string()) # test_time 2
    


def test_email():
    sender = ("Test Name", 'TestName@TestEmail.com')
    text_body = 'From: Test Name' + "\n\nMessage: " + "Test message"
    subject = 'From Test Name'
    recipients = ['citysketch@outlook.com']
    response = email_support.send_email(app, subject, sender, recipients, text_body)
    assert(response == True) # test_email test 1



if __name__ == "__main__":
    test_gmaps()
    test_autocomplete()
    test_twitter()
    test_sensitive_text()
    test_city_desc()
    test_weather()
    test_wiki()
    test_nyt()
    test_time()
    #test_email() #test manually due to outside of app contaxt flag
    print('all tests passed')
