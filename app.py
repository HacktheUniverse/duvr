from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/instructor')
def instr():
    return render_template('space.html')

@app.route('/amnh')
def space():
    return render_template('space.html')
if __name__== '__main__':
    app.run()
