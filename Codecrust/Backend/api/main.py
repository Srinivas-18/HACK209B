from flask import Flask, jsonify, request
import json
import os
import traceback
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


# Load the JSON data from a file
PROBLEMS_FILE = 'fs.json'

def load_problems():
    try:
        if not os.path.exists(PROBLEMS_FILE):
            raise FileNotFoundError(f"{PROBLEMS_FILE} not found.")
        
        with open(PROBLEMS_FILE, 'r') as f:
            data = json.load(f)

        
        problems = {}
        for topic in data:  # Iterate through top-level objects
            for key, value in topic.items():  # Access keys inside each top-level dictionary
                if key.lower() not in problems:
                    problems[key.lower()] = value  # Normalize keys for case-insensitivity
                else:
                    problems[key.lower()].extend(value)  # Append to existing key if needed
        
        print(f"Loaded problems: {problems}")  # Debugging: Print the structured data
        return problems

    except Exception as e:
        print(f"Error loading JSON file: {str(e)}")
        print(traceback.format_exc())
        raise e

@app.route('/api/problems-summary', methods=['GET'])
def get_problems_summary():
    problems = load_problems()
    try:
        summary = {
            "easy": len(problems.get("easy", [])),
            "medium": len(problems.get("medium", [])),
            "hard": len(problems.get("hard", [])),
        }
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/topic/<string:topic>', methods=['GET'])
def get_problems_by_topic(topic):
    problems = load_problems()
    print(f"Requested topic: {topic}")  # Debugging
    print(f"Available topics: {list(problems.keys())}")  # Debugging

    topic_problems = problems.get(topic.lower(), None)

    if not topic_problems:
        return jsonify({"error": f"No problems found for topic '{topic}'"}), 404

    return jsonify({"problems": topic_problems})
@app.route('/api/<string:topic>/<int:problem_id>', methods=['GET'])
def get_problem_by_topic_and_id(topic, problem_id):
    try:
        problems = load_problems()
        
        # Normalize topic to lowercase for case-insensitive search
        topic_problems = problems.get(topic.lower(), None)
        
        if not topic_problems:
            return jsonify({"error": f"No problems found for topic '{topic}'"}), 404

        # Find the problem with the given ID
        problem = next((p for p in topic_problems if p.get('id') == problem_id), None)

        if not problem:
            return jsonify({"error": f"No problem found with ID {problem_id} in topic '{topic}'"}), 404

        return jsonify(problem)

    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 500
    except json.JSONDecodeError as e:
        return jsonify({"error": "Error parsing JSON file. Please check the file format."}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@app.route('/api/user-progress', methods=['GET'])
def get_user_progress():
    try:
        problems = load_problems()
        total_problems = sum(len(topic) for topic in problems.values())
      
        solved_problems = 24  
        return jsonify({"total_problems": total_problems, "solved_problems": solved_problems})
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/problems', methods=['GET'])
def get_problems():
    try:
        problems = load_problems()
        return jsonify(problems)
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 500
    except json.JSONDecodeError as e:
        return jsonify({"error": "Error parsing JSON file. Please check the file format."}), 500
    except Exception as e:
        # Log the full error traceback
        print(f"Unexpected error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/api/problem/<int:problem_id>', methods=['GET'])
def get_problem_by_id(problem_id):
    try:
        problems = load_problems()
        all_problems = [q for topic in problems.values() for q in topic]
        problem = next((p for p in all_problems if p['id'] == problem_id), None)
        
        if problem is None:
            return jsonify({"error": "Problem not found"}), 404

        return jsonify(problem)

    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 500
    except json.JSONDecodeError as e:
        return jsonify({"error": "Error parsing JSON file. Please check the file format."}), 500
    except Exception as e:
        # Log the full error traceback
        print(f"Unexpected error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "API is running"})

if __name__ == '__main__':
    app.run(debug=True, port=3001)

