import json
import os
from openai import OpenAI
from tqdm import tqdm
from dotenv import load_dotenv

load_dotenv()

# Load the JSON file
with open("LinearTextbook.json", "r") as f:
    data = json.load(f)

# Set up the OpenAI API client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def clean_text(text, field_type):
    if not text:
        return ""  # Return an empty string if input is None or empty
    
    prompt = f"""Clean and format the following {field_type} content. Follow these guidelines:
1. Fix spacing issues and complete words properly.
2. Use Markdown syntax for mathematical symbols and subscripts/superscripts.
3. For subscripts, use underscores (e.g., A_1 for A₁).
4. For superscripts, use carets (e.g., A^-1 for A⁻¹).
5. Use LaTeX-style notation for Greek letters and special symbols (e.g., \\alpha for α, \\beta for β).
6. Preserve any existing HTML or Markdown formatting.
7. Do not include any introductory text or explanations in your response.
8. Only return the cleaned content.

Here's the content to clean:

{text}"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Updated to a valid model name
            messages=[
                {"role": "system", "content": "You are a text cleaning assistant specializing in mathematical and technical content. Your task is to clean and format the given text using Markdown and LaTeX-style notation for symbols."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=10000,
            n=1,
            temperature=0.2,
        )
        cleaned_text = response.choices[0].message.content.strip()
        return cleaned_text if cleaned_text else text  # Return original text if API returns empty
    except Exception as e:
        print(f"Error cleaning {field_type}: {e}")
        return text  # Return original text if API call fails

def clean_html(html):
    cleaned = html.strip()
    cleaned = ' '.join(cleaned.split())
    cleaned = cleaned.replace(" >", ">").replace("< ", "<")
    return cleaned

def clean_markdown(markdown):
    cleaned = markdown.strip()
    cleaned = '\n'.join(line.strip() for line in cleaned.split('\n'))
    cleaned = cleaned.replace(" )", ")").replace("( ", "(")
    return cleaned

# Iterate through each item in the JSON file
for item in tqdm(data, desc="Cleaning data"):
    if "segments" in item:
        for segment in item["segments"]:
            if "content" in segment and segment["content"]:
                segment["content"] = clean_text(segment["content"], "content")
            
            if "html" in segment and segment["html"]:
                cleaned_html = clean_html(segment["html"])
                segment["html"] = clean_text(cleaned_html, "HTML")
            
            if "markdown" in segment and segment["markdown"]:
                cleaned_markdown = clean_markdown(segment["markdown"])
                segment["markdown"] = clean_text(cleaned_markdown, "Markdown")

# Save the updated JSON to a new file
with open("cleaned_data.json", "w") as f:
    json.dump(data, f, indent=2)

print("Cleaning complete. Updated JSON saved to 'cleaned_data.json'.")
