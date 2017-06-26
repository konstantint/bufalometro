import re, os, pickle
from pkg_resources import resource_filename

def sanitize(mname):
    return re.sub('[^A-Za-z0-9-]', '', mname)

class ModelCache(dict):
    """A dictionary which knows how to access model pickle files stored in the data/ subdirectory by name"""
    
    def _load_model(self, mname):
        fname = resource_filename('bufalometro.models', 'data/' + mname + '.pkl')
        if not os.path.exists(fname):
            return None
        with open(fname, 'rb') as f:
            return pickle.load(f)
 
    def __getitem__(self, key):
        key = sanitize(key)
        if not key in self:
            m = self._load_model(key)
            if m is None:
                return None
            else:
                self[key] = m
                return m
        else:
            return self.get(key)
    
