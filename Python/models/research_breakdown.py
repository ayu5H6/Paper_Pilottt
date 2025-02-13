import pdfminer.high_level
import re

def extract_text_from_pdf(pdf_path):
    """Extract full text from a PDF"""
    return pdfminer.high_level.extract_text(pdf_path)

def extract_sections(text):
    """Identify major sections using regex"""
    sections = {}
    section_titles = ["Abstract", "Introduction", "Methodology", "Results", "Discussion", "Conclusion"]

    for title in section_titles:
        pattern = rf"(?i)\b{title}\b[\s\S]*?(?=\n[A-Z][a-z]+:|\Z)"
        match = re.search(pattern, text)
        if match:
            sections[title] = match.group().strip()
    
    return sections
