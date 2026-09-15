import roster from "./members-data.json";

export type MemberGroup = "school" | "campus" | "center";

export interface CouncilMember {
  name: string;
  email: string;
  department: string;
  school: string;
  campus: string;
  center: string;
  group: MemberGroup;
  photo: string | null;
}

export const COUNCIL_MEMBERS = roster as CouncilMember[];