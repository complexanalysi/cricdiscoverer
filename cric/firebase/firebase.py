# import os
# import json
# import firebase_admin
# from firebase_admin import credentials, firestore

# # Initialize Firebase Admin SDK
# cred = credentials.Certificate("serviceAccountKey.json")
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# # Folder containing JSON files
# folder_path = "files"

# for filename in os.listdir(folder_path):
#     if filename.endswith(".json"):
#         file_path = os.path.join(folder_path, filename)
#         with open(file_path, "r") as file:
#             data = json.load(file)
        
#         # Use filename (without extension) as document ID
#         doc_id = os.path.splitext(filename)[0]
        
#         if isinstance(data, list):  # Handle list case
#             for idx, item in enumerate(data):
#                 if isinstance(item, dict):  # Ensure each item is a dictionary
#                     db.collection("your_collection_name").add(item)  # Auto-generate document ID
#                     print(f"Uploaded item {idx+1} from {filename} to Firestore")
#                 else:
#                     print(f"Skipping item {idx+1} in {filename}, not a dictionary.")
#         else:
#             db.collection("your_collection_name").document(doc_id).set(data)
#             print(f"Uploaded {filename} as a single document.")

# print("All files uploaded successfully!")


import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

# Initialize Firebase Admin SDK securely
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Connect to Firestore
db = firestore.client()

# Define Firestore collection names based on filenames
collections = {
    "literature": "literature_data",
    "predicted": "predicted_data"
}

# Folder containing JSON files
folder_path = "files"

# Upload data securely to Firestore
for filename in os.listdir(folder_path):
    if filename.endswith(".json"):
        file_path = os.path.join(folder_path, filename)
        
        # Extract file name without extension
        file_key = os.path.splitext(filename)[0]
        
        # Ensure the file corresponds to a collection
        if file_key in collections:
            collection_name = collections[file_key]
            
            with open(file_path, "r") as file:
                data = json.load(file)

            if isinstance(data, list):  # Handle list case (multiple documents)
                for idx, item in enumerate(data):
                    if isinstance(item, dict):  # Ensure each item is a dictionary
                        db.collection(collection_name).add(item)  # Auto-generate document ID
                        print(f"Uploaded item {idx+1} from {filename} to Firestore collection '{collection_name}'")
                    else:
                        print(f"Skipping item {idx+1} in {filename}, not a dictionary.")
            else:  # Handle single document case
                db.collection(collection_name).document(file_key).set(data)
                print(f"Uploaded {filename} as a single document in '{collection_name}'")
        else:
            print(f"Skipping {filename}, no matching collection found.")

print("All valid data uploaded successfully!")  
