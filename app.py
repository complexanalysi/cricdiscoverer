import os
from flask import Flask, render_template
from dash import Dash, html
import dash_bootstrap_components as dbc

# Initialize Flask app
server = Flask(__name__)

# Route to serve the landing page
@server.route('/')
def landing_page():
    return render_template('index.html')

# Route to serve the circDiscoverer HTML file
@server.route('/circDiscoverer')
def serve_circ_discoverer():
    return render_template('circDiscoverer.html')

# Initialize Dash app
app = Dash(__name__, server=server, url_base_pathname='/', external_stylesheets=[dbc.themes.BOOTSTRAP])


application = server 
    
if __name__ == '__main__':
    app.run_server(debug=True)

