// app/components/PackageSearch.tsx

"use client";

import { useState } from 'react';
import { fetchPackageData, PackageData } from '../utils/fetchPackageData';

interface PackageSearchProps {
  onAddPackage: (pkg: { name: string; version: string }) => void;
}

const PackageSearch: React.FC<PackageSearchProps> = ({ onAddPackage }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<PackageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  // Function to search packages from PyPI
  const searchPackages = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const pkgData = await fetchPackageData(searchQuery);
      if (pkgData) {
        setSearchResults(pkgData);
        setSelectedVersion(pkgData.version); // Set latest version as default
      } else {
        setSearchResults(null);
        setError('Package not found.');
      }
    } catch (err) {
      console.error('Error fetching package:', err);
      setSearchResults(null);
      setError('An error occurred while searching for the package.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to add package
  const handleAddPackage = () => {
    if (searchResults && selectedVersion) {
      onAddPackage({ name: searchResults.name, version: selectedVersion });
      setSearchQuery('');
      setSearchResults(null);
      setSelectedVersion('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Search Packages</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mr-2"
          placeholder="Enter package name"
        />
        <button
          onClick={searchPackages}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {searchResults && (
        <div className="border border-gray-300 rounded-md p-4">
          <h3 className="text-xl font-semibold mb-2">{searchResults.name}</h3>
          <div className="mb-4">
            <label className="block mb-1">
              <span className="text-black">Select Version:</span>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                {searchResults.availableVersions.map((version, index) => (
                  <option key={index} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            onClick={handleAddPackage}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Package
          </button>
        </div>
      )}
    </div>
  );
};

export default PackageSearch;
