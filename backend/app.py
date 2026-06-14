from flask import Flask, request, jsonify
from flask_cors import CORS
from analyzer import analyze_text
from factcheck import check_facts
from scraper import extract_text_from_url
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'FakeShield v2 backend is running'})


@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    text = data.get('text', '').strip()
    url = data.get('url', '').strip()

    # If URL is given, extract text from it
    if url:
        extracted = extract_text_from_url(url)
        if not extracted:
            return jsonify({
                'error': 'Could not extract content from this URL. The site may be paywalled or blocking scrapers. Try pasting the text manually.'
            }), 400
        text = extracted

    # Validate text length
    if not text or len(text) < 20:
        return jsonify({'error': 'Please provide at least 20 characters of text to analyze.'}), 400

    # Limit text to avoid excessive token usage
    text = text[:3000]

    # Run AI analysis (score + bias)
    ai_result = analyze_text(text)

    # Run fact check (informational only — not used in score calculation)
    fact_result = check_facts(text[:200])

    # Final score = purely AI score (most accurate for arbitrary text)
    final_score = ai_result.get('score', 50)
    verdict = get_verdict(final_score)

    return jsonify({
        'score': final_score,
        'verdict': verdict,
        'analysis': ai_result.get('analysis', ''),
        'suspicious_keywords': ai_result.get('keywords', []),
        'bias': ai_result.get('bias', 'NEUTRAL'),
        'fact_checks': fact_result.get('claims', []),
        'text_preview': text[:300] + ('...' if len(text) > 300 else '')
    })


def get_verdict(score):
    if score >= 70:
        return 'LIKELY REAL'
    elif score >= 40:
        return 'UNVERIFIED'
    else:
        return 'LIKELY FAKE'


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port)
