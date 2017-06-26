import re
import numpy as np
from sklearn.base import BaseEstimator
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from .markup import AnnotatedSpan

class FeatureWeightingNB(MultinomialNB):
    """A NaiveBayes classifier with a .feature_weights_ property."""
    
    def fit(self, X, y):
        super().fit(X, y)
        self.feature_weights_ = self.feature_log_prob_[1,:] - self.feature_log_prob_[0,:]

class ExplainingWordBasedClassifier(Pipeline):
    """A classifier which takes texts as inputs and provides an additional explain method,
       for providing a list of spans in the given text, which contribute most to its final classification."""
    
    def __init__(self, vectorizer = None, classifier = None, n_levels=4):
        self.vectorizer_ = vectorizer or CountVectorizer(max_df=0.5, min_df=5)
        self.classifier_ = classifier or FeatureWeightingNB()
        super().__init__([
            ('vectorize', self.vectorizer_),
            ('classify', self.classifier_)
        ])
        self.n_levels = n_levels
        self.token_pattern_ = re.compile(self.vectorizer_.token_pattern)
        
    def fit(self, X, y):
        super().fit(X, y)
        self.levels_ = self._compute_levels()
        return self
        
    def _compute_levels(self):
        abs_weights = sorted(abs(self.classifier_.feature_weights_))
        return [abs_weights[len(abs_weights)*i//self.n_levels] for i in range(1, self.n_levels)]
    
    def explain(self, doc):
        "Returns a list of AnnotatedSpan objects referencing the given text."

        preprocess = self.vectorizer_.build_preprocessor()
        doc_preprocessed = preprocess(doc)   
        results = []
        for t in self.token_pattern_.finditer(doc_preprocessed):
            start, end, word = t.start(), t.end(), t.group()
            if word in self.vectorizer_.vocabulary_:
                idx = self.vectorizer_.vocabulary_[word]
                weight = self.classifier_.feature_weights_[idx]
                level = len([l for l in self.levels_ if l < np.abs(weight)])
                if level >= 0:
                    results.append(AnnotatedSpan(start, end, word, weight, level))
        return results


