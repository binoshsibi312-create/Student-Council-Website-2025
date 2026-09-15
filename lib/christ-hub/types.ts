export type OrgType = "department" | "school" | "club" | "cell" | "admin";

export type PostCategory = "Academic" | "Cultural" | "Sports" | "Deadline" | "Admin";

export interface ChristHubOrg {
  email: string;
  orgName: string;
  orgType: OrgType;
  logoFileId?: string;
  active: boolean;
}

export interface ChristHubPost {
  id: string;
  timestamp: string;
  orgEmail: string;
  orgName: string;
  orgType: OrgType;
  category: PostCategory;
  caption: string;
  mediaType: "image" | "video" | "none";
  driveFileId?: string;
  registrationUrl?: string;
  videoUrl?: string;
  semester: string;
  status: "published" | "hidden" | "pending" | "removed";
}

export interface ChristHubFeed {
  semester: string;
  generatedAt: string;
  orgs: ChristHubOrg[];
  posts: ChristHubPost[];
}
