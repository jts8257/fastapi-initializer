// app/templates/README.ts

const README_TEMPLATE = `# {{projectName}}

{{projectDescription}}

## How to Run

1. Activate the virtual environment:
   \`\`\`bash
   source venv/bin/activate
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`
3. Run the FastAPI server:
   \`\`\`bash
   uvicorn app.main:app --reload
   \`\`\``;

export default README_TEMPLATE;
