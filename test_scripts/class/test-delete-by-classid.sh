endpoint=http://localhost:3000
path=/api/v1/class
URL=$endpoint$path
param="?class_id=1"
curl -X "DELETE" $URL$param
