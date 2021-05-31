from flask import Flask, request
import RPi.GPIO as GPIO
from time import sleep

app = Flask(__name__)
GPIO.setmode(GPIO.BCM)
GPIO.setup(26,GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(5,GPIO.OUT, initial=GPIO.LOW)

@app.route('/openDoor', methods = ["POST"])
def openDoor():
    GPIO.output(26,1)
    GPIO.output(5,1)
    sleep(6)
    GPIO.output(26,0)
    GPIO.output(5,0)
    return ''

app.run(host='0.0.0.0',port=8090)