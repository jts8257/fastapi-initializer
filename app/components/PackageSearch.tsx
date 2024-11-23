// app/components/PackageSearch.tsx

"use client";

import { useState } from "react";
import { fetchPackageDetailData } from "../utils/fetchPackageData";
import { PackageDetailData, AvailableVersion } from "../utils/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PackageSearchProps {
  onAddPackage: (pkg: { name: string; version: string; availableVersions: AvailableVersion[] }) => void;
}

const PackageSearch: React.FC<PackageSearchProps> = ({ onAddPackage }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PackageDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false); // Description toggle state

  const sortAvailableVersions = (releases: PackageDetailData["releases"]): AvailableVersion[] => {
    return Object.keys(releases)
      .map((version) => {
        const uploads = releases[version];
        const latestUpload = uploads.reduce((latest, current) => {
          return new Date(current.upload_time_iso_8601) > new Date(latest.upload_time_iso_8601) ? current : latest;
        }, uploads[0]);
        return {
          version: version,
          upload_time_iso_8601: latestUpload.upload_time_iso_8601,
        };
      })
      .sort((a, b) => new Date(b.upload_time_iso_8601).getTime() - new Date(a.upload_time_iso_8601).getTime());
  };

  const sortVersionsByUploadTime = (releases: PackageDetailData["releases"]): string[] => {
    return Object.keys(releases)
      .map((version) => {
        // Find the latest upload time for each version
        const uploads = releases[version];
        const latestUpload = uploads.reduce((latest, current) => {
          return new Date(current.upload_time_iso_8601) > new Date(latest.upload_time_iso_8601) ? current : latest;
        }, uploads[0]);
        return { version, uploadTime: new Date(latestUpload.upload_time_iso_8601) };
      })
      .sort((a, b) => b.uploadTime.getTime() - a.uploadTime.getTime()) // Sort descending
      .map((item) => item.version);
  };

  // Function to search packages from PyPI
  const searchPackages = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsDescriptionExpanded(false); // Reset description state on new search
    try {
      const pkgData = await fetchPackageDetailData(searchQuery);
      if (pkgData) {
        setSearchResults(pkgData);
        // Set the latest version as default (Assuming the first in the sorted array)
        const sortedVersions = sortVersionsByUploadTime(pkgData.releases);
        const latestVersion = sortedVersions[0];
        setSelectedVersion(latestVersion);
      } else {
        setSearchResults(null);
        setError("Package not found.");
      }
    } catch (err) {
      console.error("Error fetching package:", err);
      setSearchResults(null);
      setError("An error occurred while searching for the package.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to add package
  const handleAddPackage = () => {
    if (searchResults && selectedVersion) {
      const sortedAvailableVersions = sortAvailableVersions(searchResults.releases);

      onAddPackage({
        name: searchResults.info.name,
        version: selectedVersion,
        availableVersions: sortedAvailableVersions,
      });

      setSearchQuery("");
      setSearchResults(null);
      setSelectedVersion("");
      setIsDescriptionExpanded(false); // Reset description state after adding
    }
  };

  const getRequiredPythonVersion = (): string => {
    if (searchResults && selectedVersion) {
      const releases = searchResults.releases[selectedVersion];
      if (releases && releases.length > 0) {
        return releases[0].requires_python || "Not specified";
      }
    }
    return "Not specified";
  };

  // Toggle description visibility
  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div>
      <h2 className="text-black text-2xl font-bold mb-4">
        Search Packages</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-gray-800 w-full p-2 border border-gray-300 rounded-md mr-2 placeholder-gray-500  bg-white"
          placeholder="Enter package name"
        />
        <button
          onClick={searchPackages}
          className="bg-green-500  text-white py-2 px-4 rounded hover:bg-green-600  transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {searchResults && (
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
          {/* First Row: Library Title, Version Select, Add Package Button */}
          <div className="flex items-center justify-between">
            {/* Library Title */}
            <h3 className="text-gray-800 text-xl font-semibold">
              {searchResults.info.name}
            </h3>

            {/* Right Side: Version Select Dropdown and Add Package Button */}
            <div className="flex items-center space-x-4">
              {/* Version Select Dropdown */}
              <div>
                <label className="block text-gray-800">
                  <span className="sr-only">Select Version</span>
                  <select
                    value={selectedVersion}
                    onChange={(e) => setSelectedVersion(e.target.value)}
                    className="text-gray-800 p-2 border border-gray-300 rounded-md bg-white"
                  >
                    {searchResults.releases && Object.keys(searchResults.releases).length > 0 ? (
                      sortVersionsByUploadTime(searchResults.releases).map((version) => (
                        <option key={version} value={version}>
                          {version}
                        </option>
                      ))
                    ) : (
                      <option value="">No versions available</option>
                    )}
                  </select>
                </label>
              </div>

              {/* Add Package Button */}
              <button
                onClick={handleAddPackage}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
              >
                Add Package
              </button>
            </div>
          </div>

          {/* Second Row: Required Python Version */}
          <p className="mt-2 text-sm text-gray-600">
            <strong>Required Python Version:</strong> {getRequiredPythonVersion()}
          </p>

          {/* Third Row: Description Toggle Button */}
          <button
            onClick={toggleDescription}
            className="mt-4 text-teal-500 hover:underline focus:outline-none"
            aria-expanded={isDescriptionExpanded}
            aria-controls={`description-${searchResults.info.name}`}
          >
            {isDescriptionExpanded ? "Hide Description" : "Show Description"}
          </button>

          {/* Collapsible Description */}
          {isDescriptionExpanded && (
            <div id={`description-${searchResults.info.name}`} className="mt-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose">
                {searchResults.info.description}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageSearch;
