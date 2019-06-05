import serial
import pynmea2
import requests

API_BASE_URL = "http://thronerapi.tecogill.com/v1"

def createSession():
	# defining the api-endpoint  
	API_ENDPOINT = API_BASE_URL + "/sessions"
	
	# data to be sent to api 
	data = {} 
	
	# sending post request and saving response as response object 
	r = requests.post(url = API_ENDPOINT, data = data) 
	
	# extracting response text  
	response = r.json()
	
	return response['_id'] 

def sendData(lat, lon, alt, session):
	# defining the api-endpoint  
	API_ENDPOINT = API_BASE_URL + "/positions"
	
	# data to be sent to api 
	data = {'lat':lat, 
			'lon':lon, 
			'alt':alt, 
			'session': session} 
	
	# sending post request and saving response as response object 
	r = requests.post(url = API_ENDPOINT, data = data) 
	
	# extracting response text  
	pastebin_url = r.text 
	print("Response :%s"%pastebin_url) 

def decimal_degrees(degrees, minutes):
    return degrees + minutes/60

def decode(coord):
    #Converts DDDMM.MMMMM > DD deg MM.MMMMM min
    try:
        x = coord.split(".")
        head = x[0]
        tail = x[1]
        deg = head[0:-2]
        min = head[-2:]
        #print(deg + " deg " + min + "." + tail + " min" )
        return decimal_degrees(float(deg), float(min + "." + tail))
    except:
        return -1

def parseGPS(str, session):
    if str.find('GGA') > 0:
        msg = pynmea2.parse(str)
        #print "Timestamp: %s -- Lat: %s %s -- Lon: %s %s -- Altitude: %s %s" % (msg.timestamp,msg.lat,msg.lat_dir,msg.lon,msg.lon_dir,msg.altitude,msg.altitude_units)
        real_lat = decode(msg.lat)
        real_lon = decode(msg.lon)
        #print (real_lat)
        #print (real_lon)
        
        if real_lat != -1 and real_lon != -1:
            sendData(real_lat, real_lon, msg.altitude, session)
            #print('Send!')
        else:
            print('No data to send!')

serialPort = serial.Serial("/dev/ttyAMA0", 9600, timeout=0.5)

session = createSession()

while True:
    str= serialPort.readline()
    parseGPS(str,session) 
