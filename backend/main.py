from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)
import dotenv
from flask_cors import CORS
import os
from datetime import timedelta

dotenv.load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
userDB = mongo.db.users


@app.route("/register", methods=["POST"])
def register():
    email = request.json.get("email")
    name = request.json.get("name")
    password = request.json.get("password")

    existing_user = userDB.find_one({"email": email})
    if existing_user:
        return jsonify({"message": "name already exists", "success": False}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    user = {"name": name, "password": hashed_password, "email": email}

    userDB.insert_one(user)

    return jsonify({"message": "Registration successful", "success": True}), 200


@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = userDB.find_one({"email": email})

    if not (user and bcrypt.check_password_hash(user["password"], password)):
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Invalid name or password",
                }
            ),
            401,
        )

    access_token = create_access_token(
        identity=email, expires_delta=timedelta(seconds=60 * 60 * 24 * 7)
    )
    del user["password"]
    print(user)
    return (
        jsonify(
            {
                "success": True,
                "message": "Logged in succesfully",
                "data": {"token": access_token, "user": user},
            }
        ),
        200,
    )


@app.route("/user", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = userDB.find_one({"email": current_user})

    return (
        jsonify(
            {"message": "User data retrieved", "success": True, "data": {"user": user}}
        ),
        200,
    )


if __name__ == "__main__":
    app.run(debug=True, port=5001)
