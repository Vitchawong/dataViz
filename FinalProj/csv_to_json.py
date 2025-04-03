import csv
import json

# Input and Output file paths
csv_file = "FinalProj\Titanic-Dataset.csv"  # Change this if your file has a different name
json_file = "titanic.json"

def csv_to_json(csv_filepath, json_filepath):
    try:
        with open(csv_filepath, mode='r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)  # Read CSV as a dictionary
            data = [row for row in csv_reader]  # Convert to list of dictionaries
        
        with open(json_filepath, mode='w', encoding='utf-8') as file:
            json.dump(data, file, indent=2)  # Save JSON file with indentation
        
        print(f"✅ Conversion successful! JSON saved as '{json_filepath}'")
    except Exception as e:
        print(f"❌ Error: {e}")

# Run the function
csv_to_json(csv_file, json_file)
