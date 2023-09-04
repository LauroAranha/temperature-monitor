# Weather Monitoring System

This repository contains the code for a weather monitoring system that collects temperature and humidity data from a DHT11 sensor using a NodeMCU (ESP8266) and sends this data to a server for storage in a MySQL database. The system consists of two main files:

`insert_weather.php`: This PHP script handles the insertion of temperature and humidity data into the MySQL database. It receives data via a GET request and inserts it into the weather table of the temperature_monitor database.

`monitor.ino`: This Arduino sketch is designed to run on a NodeMCU (ESP8266) microcontroller. It reads temperature and humidity data from a DHT11 sensor and sends it to the server using an HTTP GET request. The NodeMCU connects to a Wi-Fi network and periodically collects and transmits the data.

## Getting Started

To set up the weather monitoring system, follow these steps:

1. **Configure Wi-Fi**:
   In the monitor.ino file, provide your Wi-Fi network credentials by setting the ssid and psw variables.

2. **Server Configuration**:
   Update the server details in the monitor.ino file. Set the http_site variable to the IP address or domain name of your server, and specify the http_port and http_path accordingly.

3. **Database Setup**
   Ensure that you have a MySQL database named temperature_monitor set up on your server. The weather table should have columns wea_temp for temperature and wea_humid for humidity.

4. **Upload Code**:
   Upload the monitor.ino sketch to your NodeMCU board using the Arduino IDE or another compatible tool.

5. **Run the PHP Script**:
   Ensure that the insert_weather.php script is hosted on your server. This script will handle incoming data from the NodeMCU and insert it into the database.

## Usage

1. Power on the NodeMCU, and it will start collecting temperature and humidity data from the DHT11 sensor.

2. The NodeMCU will connect to the configured Wi-Fi network and periodically send GET requests to the server, passing the temperature and humidity data as parameters.

3. The PHP script on the server will receive the GET requests, sanitize the data, and insert it into the MySQL database.

4. You can then access the stored data in the database for further analysis or visualization.

## Troubleshooting

If you encounter any issues, check the serial monitor output of the NodeMCU for debugging information. Ensure that it successfully connects to Wi-Fi and sends GET requests to the server.

Verify that the server hosting the PHP script is accessible from the NodeMCU and that the PHP script is correctly configured to insert data into the database.
