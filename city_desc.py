import external

"""
Use wiki articles to return a description of the city
"""
def _get(city_name):
    articles = external._lookup_wikipedia(city_name)
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

select_second_article = ['New York']






#### REMOVE IN PRODUCTION
if __name__ == "__main__":
    print(_get("New York"))
#### REMOVE IN PRODUCTION
