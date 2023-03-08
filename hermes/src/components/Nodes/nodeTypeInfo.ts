// Configuration info for eacg node and edge (included the edge info since theres only one)

export type NodeVPCConfig = {
  updatedWidth: number;
  updatedHeight: number;
};

export type NodeWebServerConfig = {
  label: string;
  showConfigToggle: boolean;
  amiId: string;
  userDataScript: string;
  availabilityZone: string;
  appPath: string;
};

export type NodeDatabaseConfig = {
  label: string;
  showConfigToggle: boolean;
  engine: string;
};

export type NodeStorageContainerConfig = {
  label: string;
  showConfigToggle: boolean;
};

export type NodeStaticWebsiteConfig = {
  label: string;
  showConfigToggle: boolean;
  indexFile: string;
  errorFile: string;
  appPath: string;
};

export type EdgeSecurityGroupConnectionConfig = {
  ports: number[];
};
