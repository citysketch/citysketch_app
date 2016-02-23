import os
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.sys.path.insert(0,parentdir) 
import external
import valid_cities
import oauth2

def test_gmaps(city):
    return external._gmaps_lookup_city(city)

def test_autocomplete():
    return valid_cities.autocomplete_list()


def test_twitter(city):
    url = 'https://api.twitter.com/1.1/search/tweets.json?q=paris'
    key = '4898127648-hImwrcGlSCMqYvKIFl5BCZXAZAWunJ7FAtsrHYO'
    secret = 'BcvtY6dYTlzFboKjQXtfaQYGHNZrZSJebzA3FzQVdXSiq'
    return external._lookup_twitter(city)

def oauth_req():
    CONSUMER_KEY = 'I9CBjfoBWNLZTF71hCzo1j9XT'
    CONSUMER_SECRET = 'GGmjnZRHHUD52AdeGVD5qPr5CxibJbn6Xiq7JONi1ydzTREuCh'
    consumer = oauth2.Consumer(key=CONSUMER_KEY, secret=CONSUMER_SECRET)
    token = oauth2.Token(key=key, secret=secret)
    client = oauth2.Client(consumer, token)
    resp, content = client.request( url, method=http_method, body=post_body, headers=http_headers )
    return content
    
    home_timeline = oauth_req( 'https://api.twitter.com/1.1/statuses/home_timeline.json', 'abcdefg', 'hijklmnop' )



if __name__ == "__main__":
    #print(test_gmaps("Mexico City"))
    #print(test_autocomplete())
    print(test_twitter("paris"))
