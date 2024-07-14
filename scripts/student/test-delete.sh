endpoint=http://localhost:3000
path=/api/v1/student
URL=$endpoint$path
param="?netid=kk2024"
curl -X "DELETE" $URL$param
