import streamlit as st
import google.generativeai as genai
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()


def setup_gemini():
    """Initialize Gemini API client."""
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


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


setup_gemini()
st.title("AI Business Idea Analyzer")

description = st.text_input("Business Idea Description")
industry = st.text_input("Industry")
target_market = st.text_input("Target Market")
usp = st.text_input("Unique Selling Proposition (USP)")
problem = st.text_input("Problem Being Solved")

if st.button("Analyze"):
    result = analyze_business_idea(description, industry, target_market, usp, problem)

    st.subheader("AI Analysis Result:")
    st.json(result)
