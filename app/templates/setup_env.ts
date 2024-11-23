// app/templates/setup_env.ts

const SETUP_ENV_TEMPLATE = `#!/bin/bash

# Create virtual environment
python{{pythonVersion}} -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt`;

export default SETUP_ENV_TEMPLATE;
