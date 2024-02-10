import connexion
import os
import requests
import werkzeug.exceptions
import logging
from termcolor import colored
from flask_cors import CORS
from flask import send_from_directory, request, Response
from init import init
from config.init_config import DEBUG_COLOR

DEV_FRONTEND_URL = "http://localhost:8080/"
PORT = 3000


app = connexion.App(__name__)
app.add_api("api.yaml", strict_validation=True)
CORS(app.app)
log = logging.getLogger("werkzeug")


def send_frontend(path):
    if path == "/":
        path = "index.html"

    # If production, use the index.html from the dist folder
    if os.getenv("FLASK_ENV") == "production":
        try:
            return send_from_directory("dist", path)
        except werkzeug.exceptions.NotFound:
            return send_frontend("/")

    # In development, redirect to the DEV_FRONTEND_URL
    else:
        if request.method == "GET":
            try:
                req = f"{DEV_FRONTEND_URL}{path}"
                resp = requests.get(req)

                if resp.status_code == 404:
                    return send_frontend("/")

                excluded_headers = [
                    "content-encoding",
                    "content-length",
                    "transfer-encoding",
                    "connection",
                ]
                headers = [
                    (name, value)
                    for (name, value) in resp.raw.headers.items()
                    if name.lower() not in excluded_headers
                ]
                response = Response(resp.content, resp.status_code, headers)
                return response
            except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
                return (
                    "You are in a development environment and the \
frontend is not available at the url : "
                    + DEV_FRONTEND_URL,
                    503,
                )


# For serving the dashboard
@app.route("/")
def send_index():
    return send_frontend("/")


# For serving the dashboard assets
@app.route("/<path:path>")
def send_supporting_elements(path):
    # Disable logging for this route
    log.setLevel(logging.CRITICAL)

    return send_frontend(path)


if __name__ == "__main__":
    print("================= IlyatooGraphApp ====================")

    # Run IlyatooGraphApp init
    init()

    print("\n==================== RUN ===========================")
    print(
        "   IlyatooGraphApp is available at "
        + colored("http://localhost:" + str(PORT), DEBUG_COLOR)
    )
    print(
        "   Swagger UI is available at "
        + colored("http://localhost:" + str(PORT) + "/ui", DEBUG_COLOR)
    )
    print("=====================================================\n")
    app.run(port=PORT, debug=True)
