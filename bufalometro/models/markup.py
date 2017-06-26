from collections import namedtuple

AnnotatedSpan = namedtuple('AnnotatedSpan', ['start', 'end', 'text', 'weight', 'level'])

def markup(text, annotations, positive_class=True):
    """Given a text and a list of AnnotatedSpan objects,
    inserts HTML <span> tags around the annotated areas."""

    last_char = 0
    doc_markedup = []
    for start, end, word, weight, level in annotations:
        doc_markedup.append(text[last_char:start])
        doc_markedup.append('<span class="%s-%d" title="%s (%0.3f)">%s</span>' % ('pos' if (weight > 0) == positive_class else 'neg', 
                                 level, word, weight, text[start:end]))
        last_char = end
    doc_markedup.append(text[last_char:])
    return ''.join(doc_markedup)
