// app/utils/createProject.ts

import JSZip from 'jszip';

// Import templates as strings
import README_TEMPLATE from '../templates/README';
import MAIN_PY_TEMPLATE from '../templates/app/main';
import SETUP_ENV_TEMPLATE from '../templates/setup_env';
import REQUIREMENTS_TEMPLATE from '../templates/requirements';
import GITIGNORE_TEMPLATE from '../templates/gitignore';

export interface ProjectStructure {
  projectName: string;
  projectDescription: string;
  pythonVersion: string;
  selectedPackages: string[]; // Array of "package==version"
}

/**
 * Replaces placeholders in the template with actual project data.
 *
 * @param template - The template string with placeholders.
 * @param data - An object containing the data to replace in the template.
 * @returns The processed template with placeholders replaced.
 */
const processTemplate = (
  template: string,
  data: { [key: string]: any }
): string => {
  let processed = template;
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    if (Array.isArray(value)) {
      // Handle array replacements (for requirements.txt)
      const regex = new RegExp(`{{#${key}}}([\\s\\S]*?){{/${key}}}`, 'g');
      processed = processed.replace(
        regex,
        value.map((item: string) => item).join('\n')
      );
    } else {
      processed = processed.split(placeholder).join(value);
    }
  }
  return processed;
};

/**
 * Generates a ZIP file for the project structure and triggers the download.
 *
 * @param {ProjectStructure} projectStructure - The structure of the project to be zipped.
 * @returns {Promise<void>} - A promise that resolves when the ZIP is generated and download is triggered.
 */
export const createProjectZip = async (
  projectStructure: ProjectStructure
): Promise<void> => {
  const zip = new JSZip();

  // Prepare file contents by processing templates
  const processedFiles: { [filePath: string]: string } = {
    'README.md': processTemplate(README_TEMPLATE, {
      projectName: projectStructure.projectName,
      projectDescription: projectStructure.projectDescription,
    }),
    'requirements.txt': processTemplate(REQUIREMENTS_TEMPLATE, {
      selectedPackages: projectStructure.selectedPackages,
    }),
    'setup_env.sh': processTemplate(SETUP_ENV_TEMPLATE, {
      pythonVersion: projectStructure.pythonVersion,
    }),
    'app/main.py': MAIN_PY_TEMPLATE, // No placeholders to replace
    'app/__init__.py': '',
    '.gitignore': GITIGNORE_TEMPLATE
  };

  // Add files to the ZIP
  for (const [filePath, content] of Object.entries(processedFiles)) {
    zip.file(filePath, content);
  }

  // Generate the ZIP as a blob
  const blob = await zip.generateAsync({ type: 'blob' });

  // Create a temporary link to trigger the download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${projectStructure.projectName}.zip`;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
