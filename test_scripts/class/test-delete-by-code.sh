endpoint=http://localhost:3000
path=/api/v1/class
URL=$endpoint$path
param="?code=01:198:142"
curl -X "DELETE" $URL$param
