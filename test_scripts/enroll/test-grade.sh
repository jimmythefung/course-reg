endpoint=http://localhost:3000
path=/api/v1/enrollment
URL=$endpoint$path
curl -H "Content-Type: application/json" --data @grade.json $URL
