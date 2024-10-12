import json
import os
import time
from openai import OpenAI
from tqdm import tqdm
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
import pandas as pd

load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Initialize Pinecone (optional, if you want to directly upsert data)
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

def generate_embeddings_and_upsert(json_file_path, index_name, batch_size=100):
    # Load the JSON file
    with open(json_file_path, "r") as f:
        data = json.load(f)
    
    index = pc.Index(index_name)
    batch = []

    # Iterate through each item in the JSON file
    for item in tqdm(data, desc="Generating embeddings and upserting"):
        if "segments" in item:
            for segment in item["segments"]:
                # Prioritize markdown, then content, then HTML
                text = segment.get("markdown") or segment.get("content") or segment.get("html") or ""
                
                text = text.strip()
                
                if text:
                    # Generate embedding using OpenAI API
                    try:
                        response = client.embeddings.create(
                            model="text-embedding-3-large",
                            input=text
                        )
                        embedding = response.data[0].embedding
                        
                        # Prepare data for Pinecone
                        id = str(int(time.time())) + "_" + segment.get("segment_id")
                        vector = {
                            "id": id,
                            "values": embedding,
                            "metadata": {
                                "text": text[:1000],  # Limit metadata text to 1000 characters
                                "content_type": "markdown" if segment.get("markdown") else "content" if segment.get("content") else "html",
                                "page_number": segment.get("page_number"),
                                "segment_type": segment.get("segment_type")
                            }
                        }
                        
                        batch.append(vector)
                        
                        # If batch size is reached, upsert to Pinecone
                        if len(batch) >= batch_size:
                            index.upsert(vectors=batch)
                            batch = []
                    except Exception as e:
                        print(f"Error generating embedding or upserting: {e}")
    
    # Upsert any remaining vectors in the batch
    if batch:
        index.upsert(vectors=batch)
    
    print(f"Embeddings generated and upserted to Pinecone index: {index_name}")

# Usage
json_file_path = "cleaned_data.json"
pinecone_index_name = os.environ.get("PINECONE_INDEX")

generate_embeddings_and_upsert(json_file_path, pinecone_index_name)
