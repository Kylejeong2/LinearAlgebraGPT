import json
from tqdm import tqdm
from pinecone import Pinecone, ServerlessSpec
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Pinecone client
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

# Specify your index name
index_name = os.environ.get("PINECONE_INDEX")

# Connect to your index
index = pc.Index(index_name)

def upsert_embeddings(json_file_path, batch_size=100):
    # Load the JSON file
    with open(json_file_path, "r") as f:
        embeddings_data = json.load(f)
    
    # Prepare batches for upserting
    batches = [embeddings_data[i:i + batch_size] for i in range(0, len(embeddings_data), batch_size)]
    
    # Upsert embeddings in batches
    for iterator, batch in enumerate(tqdm(batches, desc="Upserting embeddings")):
        try:
            index.upsert(vectors=batch, namespace=os.environ.get("PINECONE_NAMESPACE") + "_" + str(iterator))
        except Exception as e:
            print(f"Error upserting batch: {e}")

if __name__ == "__main__":
    json_file_path = "embeddings_data.json"
    upsert_embeddings(json_file_path)
    print("Upsert complete!")

