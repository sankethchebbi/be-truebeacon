import csv
import json

# Open the CSV file for reading
with open('./data.csv', newline='') as csvfile:
    # Create a CSV reader
    reader = csv.reader(csvfile)
    # Skip the header row
    next(reader, None)
    # Initialize an empty list to store the JSON objects
    json_data = []
    # Iterate over each row in the CSV file
    for row in reader:
        # Extract the required fields from the row
        date = row[1].split()[0]  # Extract date from the datetime string
        total = float(row[2])     # Convert price to float
        symbol = row[3]           # Extract symbol
        # Create a dictionary representing the JSON object
        json_obj = {
            "name": date,
            "total": total,
            "symbol": symbol
        }
        # Append the JSON object to the list
        json_data.append(json_obj)

# Write the JSON data to a file
with open('output.json', 'w') as jsonfile:
    json.dump(json_data, jsonfile, indent=2)

print("Conversion completed. Output saved to output.json")
