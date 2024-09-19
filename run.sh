docker run -d \
    --name simplegeek-admin-react-app-server \
    --network intranet \
    --network-alias simplegeek-admin-react-app-server \
    -p 3040:3040 simplegeek-admin-react-app-server
