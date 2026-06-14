import requests
from bs4 import BeautifulSoup


def extract_text_from_url(url):
    """
    Fetches the given URL and extracts readable article text using BeautifulSoup.
    Returns extracted text (up to 3000 chars) or None if extraction fails.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.exceptions.Timeout:
        return None
    except requests.exceptions.RequestException:
        return None

    try:
        soup = BeautifulSoup(response.content, 'html.parser')

        # Remove tags that never contain article content
        for tag in soup(['script', 'style', 'nav', 'footer',
                         'header', 'aside', 'form', 'button']):
            tag.decompose()

        # Prefer content inside <article> tags if available
        article = soup.find('article')
        if article:
            paragraphs = article.find_all('p')
        else:
            paragraphs = soup.find_all('p')

        text_parts = []
        for p in paragraphs:
            content = p.get_text(separator=' ', strip=True)
            # Skip very short blobs (navigation links, captions, etc.)
            if len(content) > 40:
                text_parts.append(content)

        text = ' '.join(text_parts)

        # Fallback: grab all body text if paragraph extraction came up empty
        if len(text) < 100:
            text = soup.get_text(separator=' ', strip=True)
            text = ' '.join(text.split())

        return text[:3000] if text else None

    except Exception:
        return None
