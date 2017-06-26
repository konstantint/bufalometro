===========
Bufalometro
===========

`Il Bufalometro <http://bufalometro.it>`_ is a half-serious webapp for analysis of Italian text in the context of fake news detection. It was created during the Global AI Hackathon on June 24-25 in Rome.

It is currently (as of June 2017) hosted at http://bufalometro.it.

The app provides a web-based user interface for experimenting with two kinds of analysis on a given piece of text.

A. Text analysis for measuring the *style* of the message. 

   During the hackathon three basic NLP models were deployed in their most simplistic form:
   
      - A classical *sentiment analysis* model, trained to recognize literal positivity in the `SENTIPOLC <http://www.di.unito.it/~tutreeb/sentipolc-evalita16/>`_ corpus.
      - A *"Lerciosity"* classifier, trained to discriminate between texts of the Italian Wikinews articles and texts of the joke-news website http://lercio.it. The former dataset was collected by downloading the official dump, whilst the latter - by scraping the website.
      - A *"Referencity"* classifier, trained on the texts of the Italian Wikipedia to predict whether a given sentence would be followed by a reference footnote. Presumably, such sentences would contain facts which may require checking.

   As is usual for a hackathon, not much time was spent on tuning the classifiers (just getting and cleaning the data is time-consuming enough). The most basic tokenization strategy along with a Naive Bayes classifier tucked on top seemed to produce results which were reasonable and fun enough for a prototype. 

   The structure of the application makes it rather easy to experiment with other models or improve on the existing ones. A Jupyter notebook is provided to illustrate a sample model training.

   The focus on word-based models made it possible to visually highlight the effect of each word in the final classification - this visualization is shown if you click on one of the "meters" in the UI.

B. Internet search for measuring the credibility of the *content* of the message.

   Using a search engine to check whether the 
   search results for a given phrase include known credible sources or known fake sites seems to be very simple 
   yet hard to beat baseline for credibility analysis. This metric is referred to as the "Bufala Pro" analysis 
   in the UI.

Usage
-----
The webapp is currently hosted on http://bufalometro.it. It is a Flask-based Python3 webapp.
If you want to run a local instance or develop the code, clone the repository, and set up a virtualenv with the 
necessary requirement packages (optional, but highly recommended)::

   $ python3 -m venv venv
   $ . venv/bin/activate
   $ easy_install --upgrade pip
   $ pip install -r requirements.txt

Then install the package itself::

   $ python setup.py develop

and launch the app by either using the built-in Flask development server::

   $ export FLASK_APP=bufalometro.app
   $ flask run

Alternatively, you may rely on a separate container, such as ``gunicorn``::

   $ pip install gunicorn
   $ gunicorn bufalometro.app:app

If you want to try changing the models, consider studying the contents of the ``notebooks/Model - Example.ipynb`` Jupyter file.

Creators
--------
 - Konstantin Tretyakov
 - Valerio Viperino
 - Danilo Bruno
 - Guglielmo Senese
 - Giacomo Saliola
 - Daniele Ciciani
 - Marco Brilli

License
-------
 - The source code of the project is subject to the MIT License.
 - The texts of the webpage, the logo and team images are not licensed for public redistribution.
 - The project relies on several third-party open-source libraries. 
   Each of these libraries may be subject to its own license.
