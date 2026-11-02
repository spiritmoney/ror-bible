echo build in Progres

export REACT_APP_CI=false \
export REACT_APP_EMAIL_API_URL="https://rhapsodybible-notification.herokuapp.com/" \
# BUILDING FOR PWA & MOBILE!
export REACT_APP_SCRIBBBLE_URL="https://rhapsodybible.web.app/" \
# BUILDING FOR DESKTOP!
export REACT_APP_SCRIBBBLE_URL="https://rhapsodybible.web.app/desktop/" \
export REACT_APP_EMAIL_API_KEY="5f2ae3f9-4e4d-409d-a5b5-b15ec8126647" \
export REACT_APP_KINGSCHAT_CLIENT_ID="d1dc6b26-b7d5-4b81-a6fd-4a495321b2e2" \
export REACT_APP_KINGSCHAT_LOGIN_URL="https://accounts.kingschat.online/log-in" \
export REACT_APP_KINGSCHAT_REDIRECT_URL="https://rhapsodybible.web.app/auth/callback" \
export REACT_APP_KINGSCHAT_TOKEN_URL="https://connect.kingsch.at/developer/api/oauth2/token" \
export REACT_APP_KINGSCHAT_PROFILE_URL="https://connect.kingsch.at/developer/api/profile" \

craco build
