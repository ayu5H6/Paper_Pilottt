from flask import Flask, request, jsonify
from models.research_breakdown import extract_text_from_pdf, extract_sections
from models.summarization import kmeans_summary
from models.topic_extraction import extract_topics_ml

app = Flask(__name__)  # ✅ Define Flask only once

@app.route("/analyze", methods=["POST"])
def analyze():
    if "pdf" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    pdf_file = request.files["pdf"]
    temp_path = "temp.pdf"
    pdf_file.save(temp_path)

    text = extract_text_from_pdf(temp_path)
    sections = extract_sections(text)
    topics = extract_topics_ml(text)

    return jsonify({
        "sections": sections,
        "topics": topics
    })

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data["text"]
    summary = kmeans_summary(text)

    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
