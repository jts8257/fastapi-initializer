// app/utils/fetchPackageData.ts
import { PackageDetailData } from './types';

export interface PackageData {
  name: string;
  version: string;
  availableVersions: string[];
}

export const fetchPackageData = async (packageName: string): Promise<PackageData | null> => {
  try {
    const response = await fetch(`https://pypi.org/pypi/${encodeURIComponent(packageName)}/json`);
    if (response.ok) {
      const data = await response.json();
      const availableVersions = Object.keys(data.releases).sort((a, b) => {
        // Sort versions in descending order
        return new Date(data.releases[b][0].upload_time).getTime() - new Date(data.releases[a][0].upload_time).getTime();
      });
      return {
        name: data.info.name,
        version: data.info.version, // Latest version
        availableVersions,
      };
    } else {
      console.error(`Failed to fetch package data for ${packageName}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching package data for ${packageName}:`, error);
    return null;
  }
};


export const fetchPackageDetailData = async (packageName: string): Promise<PackageDetailData | null> => {
  try {
    const response = await fetch(`https://pypi.org/pypi/${packageName}/json`);
    if (!response.ok) {
      return null;
    }
    const data: PackageDetailData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching package data:', error);
    return null;
  }
};