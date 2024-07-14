endpoint=http://localhost:3000
path=/api/v1/enrollment
URL=$endpoint$path
param="?student_id=6&class_id=6"
curl -X "DELETE" $URL$param
