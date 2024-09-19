ARGS=$(cat .env | sed 's/^/--build-arg /' | tr '\n' ' ')
docker build $ARGS -t simplegeek-admin-react-app-server .
