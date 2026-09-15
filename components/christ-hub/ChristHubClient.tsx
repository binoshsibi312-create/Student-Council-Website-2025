"use client";

import { useMemo, useState } from "react";
import type { ChristHubFeed, ChristHubPost } from "@/lib/christ-hub/types";
import { usePinnedOrgs } from "@/lib/christ-hub/use-pinned-orgs";
import { isPostActive } from "@/lib/christ-hub/expiry";
import OrgAvatarRail from "./OrgAvatarRail";
import StoryViewer from "./StoryViewer";
import ArchiveSection from "./ArchiveSection";
import BroadcasterAccess from "./BroadcasterAccess";

function groupByOrg(posts: ChristHubPost[]): Map<string, ChristHubPost[]> {
  const map = new Map<string, ChristHubPost[]>();
  for (const post of posts) {
    const list = map.get(post.orgEmail) ?? [];
    list.push(post);
    map.set(post.orgEmail, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  return map;
}

export default function ChristHubClient({ initialFeed }: { initialFeed: ChristHubFeed }) {
  const [posts, setPosts] = useState(initialFeed.posts);
  const { orgs } = initialFeed;
  const [activeOrgEmail, setActiveOrgEmail] = useState<string | null>(null);
  const { pinned, togglePin } = usePinnedOrgs();

  const publishedPosts = useMemo(() => posts.filter((p) => p.status === "published"), [posts]);
  const activePosts = useMemo(() => publishedPosts.filter((p) => isPostActive(p.timestamp)), [publishedPosts]);
  const postsByOrg = useMemo(() => groupByOrg(activePosts), [activePosts]);
  const allPostsByOrg = useMemo(() => groupByOrg(publishedPosts), [publishedPosts]);

  const orgsWithPosts = useMemo(
    () =>
      orgs
        .filter((o) => (postsByOrg.get(o.email)?.length ?? 0) > 0)
        .sort((a, b) => {
          const aPinned = pinned.includes(a.email);
          const bPinned = pinned.includes(b.email);
          if (aPinned !== bPinned) return aPinned ? -1 : 1;
          const aLatest = postsByOrg.get(a.email)![0].timestamp;
          const bLatest = postsByOrg.get(b.email)![0].timestamp;
          return new Date(bLatest).getTime() - new Date(aLatest).getTime();
        }),
    [orgs, postsByOrg, pinned]
  );

  const orgsWithHistory = useMemo(
    () =>
      orgs
        .filter((o) => (allPostsByOrg.get(o.email)?.length ?? 0) > 0)
        .sort((a, b) => {
          const aLatest = allPostsByOrg.get(a.email)![0].timestamp;
          const bLatest = allPostsByOrg.get(b.email)![0].timestamp;
          return new Date(bLatest).getTime() - new Date(aLatest).getTime();
        }),
    [orgs, allPostsByOrg]
  );

  const historyCounts = useMemo(
    () => new Map(orgsWithHistory.map((o) => [o.email, allPostsByOrg.get(o.email)?.length ?? 0])),
    [orgsWithHistory, allPostsByOrg]
  );

  const orderedEmails = useMemo(() => orgsWithPosts.map((o) => o.email), [orgsWithPosts]);
  const historyOrderedEmails = useMemo(() => orgsWithHistory.map((o) => o.email), [orgsWithHistory]);

  return (
    <>
      <BroadcasterAccess clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} onPosted={(post) => setPosts((current) => [post, ...current])} />
      <OrgAvatarRail orgs={orgsWithPosts} pinned={pinned} onTogglePin={togglePin} onOpenOrg={setActiveOrgEmail} />

      <ArchiveSection orgs={orgsWithHistory} countByOrg={historyCounts} onOpenOrg={setActiveOrgEmail} />

      <StoryViewer
        key={activeOrgEmail ?? "active-story-closed"}
        orgs={orgsWithHistory}
        postsByOrg={allPostsByOrg}
        orderedEmails={historyOrderedEmails}
        activeOrgEmail={activeOrgEmail}
        onClose={() => setActiveOrgEmail(null)}
        onNavigateOrg={setActiveOrgEmail}
      />

    </>
  );
}
