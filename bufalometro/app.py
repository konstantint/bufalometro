from flask import Flask, render_template, request, jsonify
from .models.cache import ModelCache
from .models.markup import markup
from .models.web import google_credibility_score

app = Flask(__name__)
app.config.from_object('bufalometro.config.Config')
models = ModelCache()

@app.route("/")
def index():
    txt = request.args.get('text', '')
    return render_template("index.html", text=txt)

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/api/explain/<model_name>")
def explain(model_name):
    m = models[model_name]
    if m is None:
        return jsonify({'success': False, 'error': 'Invalid model name'})
    text = request.args.get('text', '')
    explain = markup(text, m.explain(text), model_name != 'sentiment')
    return jsonify({'success': True, 'explain': explain}) 

@app.route("/api/analyze")
def analyze():
    text = request.args.get('text', '')
    mnames = ['lerciosity', 'sentiment', 'referencity']
    result = {}
    for mname in mnames:
        m = models[mname]
        prob = m.predict_proba([text])[0,1]
        result[mname] = prob
    return jsonify(result)

@app.route("/api/credibility")
def credibility():
    text = request.args.get('text', '')
    score = google_credibility_score(text)
    return jsonify({'success': True, 'score': score}) 
