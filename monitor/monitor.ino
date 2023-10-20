#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SimpleDHT.h>

const char* ssid = "wifi_2";
const char* password = "1a2b3c4d5e6f";

const char* http_site = "temperature-monitor-gamma.vercel.app";
const int http_port = 443;
const char* http_path = "/cadastrar"; 

int pinDHT11 = D0;
int relay = D1;
SimpleDHT11 dht11;

unsigned long previousMillis = 0;
const long interval = 600000;

void setup() {
  Serial.begin(9600);
  pinMode(relay, OUTPUT);
  Serial.println("NodeMCU - Monitor de temperatura");
  Serial.println("Aguardando conexão");

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi conectado com sucesso: " + WiFi.localIP().toString());
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    byte temp = 0;
    byte humid = 0;
    if (dht11.read(pinDHT11, &temp, &humid, NULL)) {
      Serial.println("Falha na leitura do sensor.");
      return;
    }

    Serial.println("Sucesso na leitura do leitor, gravandao dados no banco de dados!");
    Serial.print((int)temp);
    Serial.print(" *C, ");
    Serial.print((int)humid);
    Serial.println(" %");

    if (!sendDataToServer((int)temp, (int)humid)) {
      Serial.println("Falha na requisição.");
      return;
    }

    if ((int)temp >= 20){
      digitalWrite(relay, HIGH);
      return
    }

    digitalWrite(relay, LOW);
  }
}

bool sendDataToServer(int temp, int humid) {
  WiFiClientSecure client;
  client.setInsecure();

  String url = "https://" + String(http_site) + http_path + "?umidade=" + String(humid) + "&temperatura=" + String(temp);

  Serial.println("Fazendo request: ");
  Serial.println(url);


  if (client.connect(http_site, http_port)) {
    Serial.println("Conectado ao cliente:");
    client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + http_site + "\r\n" + "Connection: close\r\n\r\n");

    while (client.connected()) {
      Serial.println("Esperando por resposta do servidor");
      String line = client.readStringUntil('\n');
      if (line == "\r") {
        break;
      }
    }

    while (client.available()) {
      Serial.println("Esperando resto da resposta");
      String line = client.readStringUntil('\n');
      Serial.println(line);
    }

    Serial.println("Concluído");

    client.stop();
    return true;
  } 
    
  Serial.println("Falha na conexão com o servidor");
  return false;
}
