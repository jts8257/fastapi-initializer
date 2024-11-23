// app/page.tsx

"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import PackageSearch from "./components/PackageSearch";
import SelectedPackages from "./components/SelectedPackages";
import { fetchPackageData, PackageData } from "./utils/fetchPackageData";
import { createProjectZip, ProjectStructure } from "./utils/createProject";

interface Package {
  name: string;
  version: string;
  availableVersions: string[];
}

export default function HomePage() {
  const [isCreateProjectDisabled, setIsCreateProjectDisabled] = useState<boolean>(true);
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [pythonVersion, setPythonVersion] = useState<string>("3.12");
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch initial packages: fastapi and uvicorn
  useEffect(() => {
    const initializePackages = async () => {
      setIsLoading(true);
      const packagesToFetch = ["fastapi", "uvicorn"];
      const fetchedPackages: Package[] = [];

      for (const pkgName of packagesToFetch) {
        const pkgData: PackageData | null = await fetchPackageData(pkgName);
        if (pkgData) {
          fetchedPackages.push({
            name: pkgData.name,
            version: pkgData.version,
            availableVersions: pkgData.availableVersions,
          });
        }
      }

      setSelectedPackages(fetchedPackages);
      setIsLoading(false);
    };

    initializePackages();
  }, []);

  // Update the disabled state based on project name input
  useEffect(() => {
    setIsCreateProjectDisabled(projectName.trim() === "");
  }, [projectName]);

  // Handle adding a package to selectedPackages
  const addPackage = async (pkg: { name: string; version: string }) => {
    // Check if the package is already added
    if (selectedPackages.find((p) => p.name === pkg.name)) {
      setError(`The package "${pkg.name}" is already added.`);
      return;
    }

    // Fetch available versions for the new package
    const pkgData: PackageData | null = await fetchPackageData(pkg.name);
    if (pkgData) {
      setSelectedPackages([
        ...selectedPackages,
        {
          name: pkgData.name,
          version: pkg.version,
          availableVersions: pkgData.availableVersions,
        },
      ]);
      setError(null); // Clear any existing errors
      setSuccessMessage(null); // Clear any existing success messages
    } else {
      setError(`Failed to fetch data for package "${pkg.name}".`);
    }
  };

  // Handle removing a package from selectedPackages
  const removePackage = (pkgName: string) => {
    setSelectedPackages(selectedPackages.filter((pkg) => pkg.name !== pkgName));
    setError(null); // Clear any existing errors
    setSuccessMessage(null); // Clear any existing success messages
  };

  // Handle updating a package's version
  const updatePackageVersion = (pkgName: string, newVersion: string) => {
    setSelectedPackages((prevPackages) =>
      prevPackages.map((pkg) =>
        pkg.name === pkgName ? { ...pkg, version: newVersion } : pkg
      )
    );
    setError(null); // Clear any existing errors
    setSuccessMessage(null); // Clear any existing success messages
  };

  // Handle creating the project
  const createProject = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Resolve package versions
      const resolvedPackages = selectedPackages.map(
        (pkg) => `${pkg.name}==${pkg.version}`
      );

      // Define project structure
      const projectStructure: ProjectStructure = {
        projectName,
        projectDescription,
        pythonVersion,
        selectedPackages: resolvedPackages,
      };

      // Use the utility function to create and download the ZIP
      await createProjectZip(projectStructure);
      setSuccessMessage("Project ZIP has been downloaded successfully.");
    } catch (err) {
      console.error("Error creating project:", err);
      setError("An error occurred while creating the project.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="flex items-center justify-center bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-teal-600">FastAPI Initializer</h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 p-8 flex-1">
        {/* Left Panel */}
        <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Project Setup</h2>
          <label className="block mb-2">
            <span className="text-black">Project Name:</span>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter project name"
            />
          </label>
          <label className="block mb-2">
            <span className="text-black">Project Description:</span>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter project description"
            />
          </label>
          <label className="block mb-4">
            <span className="text-black">Python Version:</span>
            <select
              value={pythonVersion}
              onChange={(e) => setPythonVersion(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="3.9">3.9</option>
              <option value="3.10">3.10</option>
              <option value="3.11">3.11</option>
              <option value="3.12">3.12</option>
              <option value="3.13">3.13</option>
            </select>
          </label>
          {/* Display success message if any */}
          {successMessage && (
            <p className="text-green-500 mb-2">{successMessage}</p>
          )}
          {/* Display error message if any */}
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {/* SelectedPackages Component */}
          <SelectedPackages
            packages={selectedPackages}
            onRemovePackage={removePackage}
            onUpdatePackageVersion={updatePackageVersion}
          />
          <button
            onClick={createProject}
            className={clsx(
              "py-2 px-4 rounded transition duration-200 mt-5 w-full",
              {
                "bg-blue-500 text-white hover:bg-blue-600":
                  !isCreateProjectDisabled && !isLoading,
                "bg-gray-400 text-gray-700 cursor-not-allowed":
                  isCreateProjectDisabled || isLoading,
              }
            )}
            disabled={isCreateProjectDisabled || isLoading}
          >
            {isLoading ? "Creating Project..." : "Create Project"}
          </button>
        </div>

        {/* Right Panel */}
        <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-6">
          <PackageSearch onAddPackage={addPackage} />
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-white shadow-md p-4 flex justify-center space-x-6">
        <a
          href="https://github.com/jts8257/fastapi-initializer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 inline-block mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.093 3.292 9.415 7.863 10.958.575.105.785-.25.785-.56 0-.276-.01-1.006-.015-1.97-3.2.696-3.88-1.544-3.88-1.544-.522-1.33-1.28-1.688-1.28-1.688-1.04-.711.08-.696.08-.696 1.152.081 1.76 1.183 1.76 1.183 1.022 1.75 2.687 1.245 3.342.952.104-.741.4-1.245.727-1.533-2.56-.291-5.244-1.28-5.244-5.695 0-1.259.45-2.289 1.185-3.096-.12-.292-.515-1.465.114-3.054 0 0 .966-.309 3.17 1.18a10.92 10.92 0 012.89-.388c.978.005 1.96.132 2.89.388 2.204-1.489 3.17-1.18 3.17-1.18.63 1.589.236 2.762.116 3.054.74.807 1.185 1.837 1.185 3.096 0 4.424-2.69 5.4-5.25 5.685.41.354.775 1.05.775 2.117 0 1.53-.014 2.764-.014 3.135 0 .313.206.67.79.56A12.504 12.504 0 0023.5 12c0-6.352-5.148-11.5-12-11.5z" />
          </svg>
          GitHub
        </a>
        <a
          href="mailto:k.jts8257@example.com"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 inline-block mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 13.065L2 6.25V17.75A1.75 1.75 0 003.75 19.5H20.25A1.75 1.75 0 0022 17.75V6.25L12 13.065zM12 5.75L22 12.565V4.5A1.75 1.75 0 0020.25 2.75H3.75A1.75 1.75 0 002 4.5V12.565L12 5.75z" />
          </svg>
          Email
        </a>
      </footer>
    </div>      
  
  );
}
