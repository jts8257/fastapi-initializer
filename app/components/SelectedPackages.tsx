// app/components/SelectedPackages.tsx

"use client";

import React from "react";

interface AvailableVersion {
  version:string;
  upload_time_iso_8601: string;
}

interface Package {
  name: string;
  version: string;
  availableVersions: string[];
}

interface SelectedPackagesProps {
  packages: Package[];
  onRemovePackage: (pkgName: string) => void;
  onUpdatePackageVersion: (pkgName: string, newVersion: string) => void;
}

const SelectedPackages: React.FC<SelectedPackagesProps> = ({
  packages,
  onRemovePackage,
  onUpdatePackageVersion,
}) => {
  return (
    <div>
      <h3 className="text-black text-xl font-semibold mb-4">Selected Packages</h3>
      {packages.length === 0 ? (
        <p className="text-gray-500">No packages selected.</p>
      ) : (
        <ul className="space-y-4">
          {packages.map((pkg, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm"
            >
              <div className="flex items-center space-x-4">
                {/* 패키지 이름 */}
                <span className="font-medium text-gray-800">{pkg.name}</span>

                {/* 버전 선택 드롭다운 */}
                {pkg.availableVersions && pkg.availableVersions.length > 0 ? (
                  <select
                    value={pkg.version}
                    onChange={(e) => onUpdatePackageVersion(pkg.name, e.target.value)}
                    className="text-gray-800 p-2 border border-gray-300 rounded-md bg-white"
                  >
                    {pkg.availableVersions.map((version, idx) => (
                      <option key={idx} value={version}>
                        {version}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-gray-500">No versions available</span>
                )}
              </div>

              {/* Remove 버튼 */}
              <button
                onClick={() => onRemovePackage(pkg.name)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectedPackages;
