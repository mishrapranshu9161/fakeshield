import os
import requests
from dotenv import load_dotenv

load_dotenv()


def check_facts(query_text):
    """
    Query the Google Fact Check Tools API using a short extract of the text.
    Returns a credibility score and a list of related fact-check claims.

    If GOOGLE_FACT_CHECK_API_KEY is not set in .env, this returns a neutral
    score of 50 with no claims — the app still works fine without it.
    """
    api_key = os.environ.get("GOOGLE_FACT_CHECK_API_KEY", "")

    if not api_key:
        return {"score": 50, "claims": []}

    # Clean the query — collapse whitespace, cap at 100 chars
    query = " ".join(query_text.split())[:100]

    try:
        response = requests.get(
            "https://factchecktools.googleapis.com/v1alpha1/claims:search",
            params={"query": query, "key": api_key, "pageSize": 3},
            timeout=8
        )
        response.raise_for_status()
        data = response.json()

    except requests.exceptions.Timeout:
        return {"score": 50, "claims": []}
    except requests.exceptions.RequestException:
        return {"score": 50, "claims": []}
    except Exception:
        return {"score": 50, "claims": []}

    raw_claims = data.get("claims", [])
    if not raw_claims:
        return {"score": 50, "claims": []}

    claims = []
    fake_count = 0
    real_count = 0

    fake_signals = [
        'false', 'fake', 'misleading', 'incorrect', 'wrong',
        'pants on fire', 'inaccurate', 'fabricated', 'debunked', 'unsupported'
    ]
    real_signals = [
        'true', 'correct', 'accurate', 'verified', 'mostly true',
        'confirmed', 'legitimate', 'real'
    ]

    for raw in raw_claims[:3]:
        claim_text = raw.get('text', '')
        claimant = raw.get('claimant', 'Unknown source')
        reviews = raw.get('claimReview', [])

        rating = 'Unverified'
        publisher = ''
        claim_url = ''

        if reviews:
            first_review = reviews[0]
            rating = first_review.get('textualRating', 'Unverified')
            publisher = first_review.get('publisher', {}).get('name', '')
            claim_url = first_review.get('url', '')

        rating_lower = rating.lower()
        if any(s in rating_lower for s in fake_signals):
            fake_count += 1
        elif any(s in rating_lower for s in real_signals):
            real_count += 1

        claims.append({
            'claim': claim_text[:200],
            'claimant': claimant,
            'rating': rating,
            'publisher': publisher,
            'url': claim_url
        })

    # Derive a score from what the fact-checkers found
    if fake_count > real_count:
        score = 20
    elif real_count > fake_count:
        score = 80
    else:
        score = 50

    return {"score": score, "claims": claims}
