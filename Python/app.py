from flask import Flask, request, jsonify
from flask_cors import CORS
import language_tool_python

app = Flask(__name__)
CORS(app)

tool = language_tool_python.LanguageTool('en-US')

@app.route('/check-grammar', methods=['POST'])
def check_grammar():
    data = request.get_json()
    text = data.get('text', '')

    matches = tool.check(text)
    corrected_text = language_tool_python.utils.correct(text, matches)

    detailed_issues = []
    for match in matches:
        issue = {
            'errorText': text[match.offset : match.offset + match.errorLength],
            'suggestions': match.replacements,
            'message': match.message,
            'context': match.context.text,
            'offset': match.offset,
            'length': match.errorLength
        }
        detailed_issues.append(issue)

    return jsonify({
        'original': text,
        'corrected': corrected_text,
        'issues': detailed_issues
    })

if __name__ == '__main__':
    app.run(debug=True)
