from fastembed import TextEmbedding, SparseTextEmbedding

# dense (indo E5)
dense_model = TextEmbedding(
    # model_name="LazarusNLP/all-indo-e5-small-v4"
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# pakai BM25 -> SPLADE lebih berat
sparse_model = SparseTextEmbedding(
    model_name="Qdrant/bm25"
)

#karena e5 itu butuh prefix query dan passage pada DENSE VECTOR, supaya terbaca jelas dan mempercepat
# gajadi pake e5
def embed_dense(text: str):
    return list(dense_model.embed([text]))[0].tolist()

# def embed_dense_query(text: str):
#     return list(dense_model.embed([f"query: {text}"]))[0]

# def embed_dense_passage(text: str):
#     return list(dense_model.embed([f"passage: {text}"]))[0]

# def embed_sparse(text: str):
#     return list(sparse_model.embed([text]))[0]

def embed_sparse(text: str):
    emb = list(sparse_model.embed([text]))[0]
    return {
        "indices": emb.indices.tolist(),
        "values": emb.values.tolist()
    }
