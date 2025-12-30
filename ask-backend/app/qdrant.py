from qdrant_client import QdrantClient
from qdrant_client.models import FieldCondition, NamedVector, NamedSparseVector, SparseVector, PointStruct
import os

# QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant.pradanayahya.me")
QDRANT_HOST = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION = "ask_docs_e5"

# Gunakan host (without https://) dengan explicit https=True dan port=443
client = QdrantClient(
    host=QDRANT_HOST,
    port=443,
    https=True,
    api_key=QDRANT_API_KEY,
    timeout=120.0,
    prefer_grpc=False
)

def upsert_point(point_id: int, dense, sparse, payload: dict):
    client.upsert(
        collection_name=COLLECTION,
        points=[
            PointStruct(
                id=point_id,
                vector={
                    "dense": dense,
                    "sparse": SparseVector(
                        indices=sparse["indices"],
                        values=sparse["values"]
                    )
                },
                payload=payload
            )
        ]
    )

def hybrid_search(dense, sparse, limit=5, room_filter=None):
    # Hybrid search menggunakan Query API dengan RRF (Reciprocal Rank Fusion)
    from qdrant_client.models import Prefetch, Query, FusionQuery, Filter, FieldCondition, MatchValue
    
    #query room
    query_room = None
    if room_filter:
        query_filter = Filter(
            must=[
                FieldCondition(
                    key="room",
                    match=MatchValue(value=room_filter)
                )
            ]
        )

    response = client.query_points(
        collection_name=COLLECTION,
        prefetch=[
            Prefetch(
                query=dense,
                using="dense",
                limit=limit * 2,  # ambil lebih banyak untuk fusion
                filter=query_filter
            ),
            Prefetch(
                query=SparseVector(
                    indices=sparse["indices"], # id kata di vocabulary
                    values=sparse["values"] # nilai sparse bobot
                ),
                using="sparse",
                limit=limit * 2,
                filter=query_filter
            )
        ],
        query=FusionQuery(fusion="rrf"),  # Reciprocal Rank Fusion
        limit=limit,
        with_payload=True
    )
    
    return response.points