# START AND POINT TO LOCAL API

# sh logo.sh

# NOTE: Do NOT export PORT here. `npm run react` already sets PORT=3400
# for itself via `cross-env` in package.json. Exporting it globally in this
# shell also leaks into `node src/server.js` (the backend), which reads
# `process.env.PORT || 3000` and would then wrongly bind to 3400 too,
# causing a port conflict and breaking the /proxy route (which targets
# http://localhost:3000 in src/setupProxy.js).
export REACT_APP_EMAIL_API_URL="http://localhost:3401/" \
export REACT_APP_SCRIBBBLE_URL="http://localhost:3400/" \
export REACT_APP_EMAIL_API_KEY="5f2ae3f9-4e4d-409d-a5b5-b15ec8126647" \
export REACT_APP_KINGSCHAT_CLIENT_ID="d1dc6b26-b7d5-4b81-a6fd-4a495321b2e2" \
export REACT_APP_KINGSCHAT_CHAT_CLIENT_ID="com.kingschat" \
export REACT_APP_RORBIBLE_KINGSCHAT_REFRESH_TOKEN="8Y0oB5c3891w+chuPhVyQYGWLHpRiXAj8+OyAqUE76s=" \

npm run dev:payments
