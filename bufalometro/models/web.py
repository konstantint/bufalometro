from functools import lru_cache
from urllib.parse import urlparse
from google import search

good_hosts = {"tg24.sky.it",
              "www.corriere.it",
              "www.repubblica.it",
              "www.lastampa.it",
              "www.ilmessaggero.it",
              "www.ilgiornale.it",
              "www.ilfattoquotidiano.it",
              "www.gazzetta.it",
              "www.corrieredellosport.it",
              "www.ansa.it",
              "www.ilsole24ore.com",
              "www.ilpost.it",
              "www.huffingtonpost.it",
              "www.liberoquotidiano.it",
              "www.tgcom24.mediaset.it"}

bad_hosts = {"www.lercio.it"}

@lru_cache(500)
def google_credibility_score(text):
    """Measures credibility of a piece of text based on google search results. Return 0...1"""
    
    if len(text) < 10: return 0.5
    hosts = {urlparse(url).hostname.lower() for url in search(text, tld='it', lang='it', num=25, stop=1)}
    score = len(hosts & good_hosts) - 4*len(hosts & bad_hosts)
    return 0.5**max(score, 0)
