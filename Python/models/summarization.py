import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

def split_into_sentences(text):
    """Splits text into sentences using regex."""
    sentences = re.split(r'(?<=[.!?]) +', text)
    return [s.strip() for s in sentences if s.strip()]

def kmeans_summary(text, num_summary_sentences=5):
    """Summarize text using KMeans clustering"""
    sentences = split_into_sentences(text)
    if len(sentences) <= num_summary_sentences:
        return " ".join(sentences)

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(sentences)

    num_clusters = min(num_summary_sentences, len(sentences))
    km = KMeans(n_clusters=num_clusters, random_state=42)
    km.fit(tfidf_matrix)
    clusters = km.predict(tfidf_matrix)

    summary_sentences = []
    for cluster in range(num_clusters):
        indices = np.where(clusters == cluster)[0]
        if len(indices) == 0:
            continue
        centroid = km.cluster_centers_[cluster]
        distances = np.linalg.norm(tfidf_matrix[indices].toarray() - centroid, axis=1)
        best_index = indices[np.argmin(distances)]
        summary_sentences.append(sentences[best_index])

    return " ".join(summary_sentences)
