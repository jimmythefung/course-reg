endpoint=http://localhost:3000
path=/api/v1/class
URL=$endpoint$path
curl -H "Content-Type: application/json" --data @class.json $URL
