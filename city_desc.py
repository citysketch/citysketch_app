import external
import requests

"""
Return description of the city, uses wiki as v0
"""
select_second_article = ['New York']

def _get(city_name):
    articles = get_wiki(city_name)
    # if 'New York' select second articles
    if (city_name in select_second_article):
        title = articles[1][1]
        text = articles[2][1]
        url = articles[3][1]
    # otherwise select first article
    else:
        title = articles[1][0]
        text = articles[2][0]
        url = articles[3][0]
    response = {'title': title, 'text': text, 'url': url}
    return response


def get_wiki(city_name):
    url = 'https://en.wikipedia.org/w/api.php'
    params = {
        'action': 'opensearch',
        'search': city_name,
        'format': 'json'
    }
    response = requests.get(url, params=params).json()
    return response
