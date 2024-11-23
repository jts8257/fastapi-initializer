// app/utils/types.ts

export interface PackageInfo {
    author: string;
    author_email: string;
    bugtrack_url: string | null;
    classifiers: string[];
    description: string;
    description_content_type: string;
    docs_url: string | null;
    download_url: string;
    downloads: {
      last_day: number;
      last_month: number;
      last_week: number;
    };
    dynamic: string | null;
    home_page: string;
    keywords: string;
    license: string;
    license_expression: string | null;
    license_files: string[] | null;
    maintainer: string;
    maintainer_email: string;
    name: string;
    package_url: string;
    platform: string | null;
    project_url: string;
    project_urls: { [key: string]: string };
    provides_extra: string | null;
    release_url: string;
    requires_dist: string[] | null;
    requires_python: string | null;
    summary: string;
    version: string;
    yanked: boolean;
    yanked_reason: string | null;
  }
  
  export interface Release {
    comment_text: string;
    digests: {
      blake2b_256: string;
      md5: string;
      sha256: string;
    };
    downloads: number;
    filename: string;
    has_sig: boolean;
    md5_digest: string;
    packagetype: string;
    python_version: string;
    requires_python: string | null;
    size: number;
    upload_time: string;
    upload_time_iso_8601: string;
    url: string;
    yanked: boolean;
    yanked_reason: string | null;
  }
  
  export interface PackageDetailData {
    info: PackageInfo;
    last_serial: number;
    releases: {
      [version: string]: Release[];
    };
    urls: Release[];
    vulnerabilities: any[];
  }
  
  export interface AvailableVersion {
    version:string;
    upload_time_iso_8601: string;
  }
  
  export interface Package {
    name: string;
    version: string;
    availableVersions: AvailableVersion[];
  }