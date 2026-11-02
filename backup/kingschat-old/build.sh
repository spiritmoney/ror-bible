echo build in Progres

export REACT_APP_CI=false \
export REACT_APP_EMAIL_API_URL="https://rhapsodybible-notification.herokuapp.com/" \
# BUILDING FOR PWA & MOBILE!
export REACT_APP_SCRIBBBLE_URL="https://rhapsodybible.web.app/" \
# BUILDING FOR DESKTOP!
export REACT_APP_SCRIBBBLE_URL="https://rhapsodybible.web.app/desktop/" \
export REACT_APP_EMAIL_API_KEY="5f2ae3f9-4e4d-409d-a5b5-b15ec8126647" \
export REACT_APP_KINGSCHAT_CLIENT_ID="7e71218b-c1c0-447b-af28-ea42e2d33e3a" \

craco build
