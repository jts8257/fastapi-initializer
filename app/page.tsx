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
    </div>

  );
}
