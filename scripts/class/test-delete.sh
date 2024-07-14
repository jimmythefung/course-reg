endpoint=http://localhost:3000
path=/api/v1/class
URL=$endpoint$path
param="?code=01:640:491"
curl -X "DELETE" $URL$param
# echo $URL$param
