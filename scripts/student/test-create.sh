endpoint=http://localhost:3000
path=/api/v1/student
URL=$endpoint$path
curl -H "Content-Type: application/json" --data @student.json $URL
