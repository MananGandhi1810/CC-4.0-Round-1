from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)
from flask_cors import CORS
import os
import json
import re
import dotenv
import google.generativeai as genai
from datetime import timedelta

dotenv.load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
userDB = mongo.db.users


def clean_json_response(response_text):
    """Extracts and cleans JSON from AI response if enclosed in triple backticks."""
    json_match = re.search(r"```json\n(.*)\n```", response_text, re.DOTALL)
    return json_match.group(1) if json_match else response_text


def analyze_business_idea(description, industry, target_market, usp, problem):
    """Generates a SWOT analysis and feasibility score in JSON format using Gemini AI."""
    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = f"""
    Perform a SWOT analysis and assess the feasibility of the following business idea.
    Provide ONLY a JSON output with these fields:
    
    {{
        "strengths": ["List key strengths"],
        "weaknesses": ["List key weaknesses"],
        "opportunities": ["List opportunities for growth and expansion"],
        "threats": ["List potential threats and challenges"],
        "feasibility_score": "A numerical score between 0 and 100 indicating feasibility",
        "reasoning": "Brief explanation of the feasibility score"
    }}
    
    Description: {description}
    Industry: {industry}
    Target Market: {target_market}
    Unique Selling Proposition (USP): {usp}
    Problem Being Solved: {problem}
    """

    response = model.generate_content(prompt)

    if not response or not hasattr(response, "text"):
        return {"error": "No response from AI model."}

    cleaned_json = clean_json_response(response.text)

    try:
        return json.loads(cleaned_json)
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response. Please try again."}


@app.route("/analyze_business_idea", methods=["POST"])
def analyze():
    data = request.json
    required_fields = ["description", "industry", "target_market", "usp", "problem"]

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    result = analyze_business_idea(
        data["description"],
        data["industry"],
        data["target_market"],
        data["usp"],
        data["problem"],
    )

    return jsonify(result)


@app.route("/register", methods=["POST"])
def register():
    email = request.json.get("email")
    name = request.json.get("name")
    password = request.json.get("password")

    existing_user = userDB.find_one({"email": email})
    if existing_user:
        return jsonify({"message": "User already exists", "success": False}), 400

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
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

    access_token = create_access_token(identity=email, expires_delta=timedelta(days=7))
    del user["password"]
    return (
        jsonify(
            {
                "success": True,
                "message": "Logged in successfully",
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
