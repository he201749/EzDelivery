import requests
import json
import schedule
import time
import os, sys
import serial
import RPi.GPIO as GPIO
from time import sleep
from datetime import date
from datetime import datetime


numBoite='1'
x=requests.get('https://51.91.102.255:8080/api/livraisons/'+numBoite, verify=False)
tabColis=json.loads(x.text)
#code=open('/dev/hidraw3', 'rb')
GPIO.setmode(GPIO.BCM)
GPIO.setup(26,GPIO.OUT, initial=GPIO.LOW)

def chargeLivraisons():
    x=requests.get('https://51.91.102.255:8080/api/livraisons/'+numBoite, verify=False)
    tabColis=json.loads(x.text)
    
schedule.every(30).minutes.do(chargeLivraisons)


while 1:
    schedule.run_pending()
    num=input("")
    for i in range(len(tabColis)):
        if num==tabColis[i]["numcolis"] and tabColis[i]["datefin"] is not None:
            bonneDate= tabColis[i]["datefin"][:10]
            b=datetime.strptime(bonneDate,'%Y-%m-%d')
            if date.today() == b.date():
                print('equals')
                GPIO.output(26,1)
                sleep(1)
                GPIO.output(26,0)
                requests.put('https://51.91.102.255:8080/api/livraisons/'+str(tabColis[i]["id"]), verify=False)
                x=requests.get('https://51.91.102.255:8080/api/livraisons/'+numBoite, verify=False)
                tabColis=json.loads(x.text)
                
        if num==tabColis[i]["numcolis"] and tabColis[i]["datefin"] is None:
            print('equals1')
            GPIO.output(26,1)
            sleep(1)
            GPIO.output(26,0)
            requests.put('https://51.91.102.255:8080/api/livraisons/'+str(tabColis[i]["id"]), verify=False)
            x=requests.get('https://51.91.102.255:8080/api/livraisons/'+numBoite, verify=False)
            tabColis=json.loads(x.text)
            
        
        
        
