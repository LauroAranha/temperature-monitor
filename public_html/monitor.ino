#include <ESP8266WiFi.h>
#include <SimpleDHT.h>

// WiFi - Coloque aqui suas configurações de WI-FI
const char ssid[] = "wifi01";
const char psw[] = "1a2b3c4d5e6f";

// Site remoto - Coloque aqui os dados do site que vai receber a requisição GET
const char http_site[] = "10.0.0.107";
const int http_port = 8080;
const char http_path[] = "/insert_weather.php";

// Variáveis globais
WiFiClient client;
IPAddress server(10, 0, 0, 107);  // Endereço IP do servidor - http_site
int pinDHT11 = D0;
SimpleDHT11 dht11;

void setup() {
  delay(30000);
  Serial.begin(9600);
  Serial.println("NodeMCU - Gravando dados no BD via GET");
  Serial.println("Aguardando conexão");

  // Tenta conexão com Wi-Fi
  WiFi.begin(ssid, psw);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.print("\nWi-Fi conectado com sucesso: ");
  Serial.println(ssid);
}

void loop() {

  // Leitura do sensor DHT11
  delay(3000);  // delay entre as leituras
  byte temp = 0;
  byte humid = 0;
  if (dht11.read(pinDHT11, &temp, &humid, NULL)) {
    Serial.print("Falha na leitura do sensor.");
    return;
  }

  Serial.println("Gravando dados no BD: ");
  Serial.print((int)temp);
  Serial.print(" *C, ");
  Serial.print((int)humid);
  Serial.println(" %");

  // Envio dos dados do sensor para o servidor via GET
  if (!getPage((int)temp, (int)humid)) {
    Serial.println("GET request failed");
  }
}

// Executa o HTTP GET request no site remoto
bool getPage(int temp, int humid) {
  if (!client.connect(server, http_port)) {
    Serial.println("Falha na conexão com o site");
    return false;
  }
  String param = "?temp=" + String(temp) + "&humid=" + String(humid);  // Parâmetros com as leituras
  Serial.println(param);
  client.print("GET ");
  client.print(http_path);
  client.print(param);
  client.println(" HTTP/1.1");
  client.print("Host: ");
  client.println(http_site);
  client.println("Connection: close");
  client.println();

  // Informações de retorno do servidor para debug
  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  return true;
}
