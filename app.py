from flask import Flask, render_template, request, jsonify, redirect, url_for
import sqlite3
import os

app = Flask(__name__, static_folder='.', template_folder='.')

# Database initialization
def init_db():
    if not os.path.exists('database.db'):
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()

init_db()

# Routes for serving your pages
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/index.html')
def signup():
    return render_template('index.html')

@app.route('/login.html')
def login():
    return render_template('login.html')

# API endpoint for user registration
@app.route('/api/signup', methods=['POST'])
def api_signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'Please fill in all fields.'}), 400
    
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
                      (name, email, password))
        conn.commit()
        return jsonify({'success': True, 'redirect': 'home.html'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Email already exists.'}), 400
    finally:
        conn.close()

# Serve static files
@app.route('/<path:filename>')
def serve_static(filename):
    return app.send_static_file(filename)

if __name__ == '__main__':
    app.run(debug=True)