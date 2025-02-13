from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer

def extract_topics_ml(text, num_topics=5, num_words=5):
    """Extracts topics using Latent Dirichlet Allocation (LDA)"""
    vectorizer = CountVectorizer(stop_words='english')
    dtm = vectorizer.fit_transform([text])
    lda = LatentDirichletAllocation(n_components=num_topics, random_state=42)
    lda.fit(dtm)

    topics = []
    for topic in lda.components_:
        top_indices = topic.argsort()[-num_words:][::-1]
        topic_words = [vectorizer.get_feature_names_out()[i] for i in top_indices]
        topics.append(" ".join(topic_words))
    return topics
