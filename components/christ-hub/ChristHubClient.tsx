"use client";

import { useMemo, useState } from "react";
import type { ChristHubFeed, ChristHubPost } from "@/lib/christ-hub/types";
import { usePinnedOrgs } from "@/lib/christ-hub/use-pinned-orgs";
import { isPostActive } from "@/lib/christ-hub/expiry";
import FilterTabs, { type FeedFilter } from "./FilterTabs";
import OrgAvatarRail from "./OrgAvatarRail";
import PostCard from "./PostCard";
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
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [activeOrgEmail, setActiveOrgEmail] = useState<string | null>(null);
  const [archiveOrgEmail, setArchiveOrgEmail] = useState<string | null>(null);
  const { pinned, togglePin } = usePinnedOrgs();

  const publishedPosts = useMemo(() => posts.filter((p) => p.status === "published"), [posts]);
  const activePosts = useMemo(() => publishedPosts.filter((p) => isPostActive(p.timestamp)), [publishedPosts]);
  const archivedPosts = useMemo(() => publishedPosts.filter((p) => !isPostActive(p.timestamp)), [publishedPosts]);

  const postsByOrg = useMemo(() => groupByOrg(activePosts), [activePosts]);
  const archivedByOrg = useMemo(() => groupByOrg(archivedPosts), [archivedPosts]);

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

  const orgsWithArchive = useMemo(
    () =>
      orgs
        .filter((o) => (archivedByOrg.get(o.email)?.length ?? 0) > 0)
        .sort((a, b) => {
          const aLatest = archivedByOrg.get(a.email)![0].timestamp;
          const bLatest = archivedByOrg.get(b.email)![0].timestamp;
          return new Date(bLatest).getTime() - new Date(aLatest).getTime();
        }),
    [orgs, archivedByOrg]
  );

  const archiveCounts = useMemo(
    () => new Map(orgsWithArchive.map((o) => [o.email, archivedByOrg.get(o.email)?.length ?? 0])),
    [orgsWithArchive, archivedByOrg]
  );

  const orderedEmails = useMemo(() => orgsWithPosts.map((o) => o.email), [orgsWithPosts]);
  const archiveOrderedEmails = useMemo(() => orgsWithArchive.map((o) => o.email), [orgsWithArchive]);

  const orgsByEmail = useMemo(() => new Map(orgs.map((o) => [o.email, o])), [orgs]);

  const visiblePosts = useMemo(() => {
    const filtered =
      filter === "all"
        ? activePosts
        : filter === "following"
          ? activePosts.filter((p) => pinned.includes(p.orgEmail))
          : filter === "club"
            ? activePosts.filter((p) => p.orgType === "club" || p.orgType === "cell")
            : activePosts.filter((p) => p.orgType === filter);
    return [...filtered].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [activePosts, filter, pinned]);

  return (
    <>
      <BroadcasterAccess clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} onPosted={(post) => setPosts((current) => [post, ...current])} />
      <OrgAvatarRail orgs={orgsWithPosts} pinned={pinned} onTogglePin={togglePin} onOpenOrg={setActiveOrgEmail} />

      <FilterTabs active={filter} onChange={setFilter} followingCount={pinned.length} />

      {visiblePosts.length === 0 ? (
        <p className="text-text-muted text-[0.9rem] font-light py-6">
          {filter === "following"
            ? "You haven't followed any orgs with recent posts yet — tap the ★ on an avatar above to follow one."
            : "No posts in this category yet."}
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-5">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              logoFileId={orgsByEmail.get(post.orgEmail)?.logoFileId}
              onOpenOrg={setActiveOrgEmail}
            />
          ))}
        </div>
      )}

      <ArchiveSection orgs={orgsWithArchive} countByOrg={archiveCounts} onOpenOrg={setArchiveOrgEmail} />

      <StoryViewer
        key={activeOrgEmail ?? "active-story-closed"}
        orgs={orgsWithPosts}
        postsByOrg={postsByOrg}
        orderedEmails={orderedEmails}
        activeOrgEmail={activeOrgEmail}
        onClose={() => setActiveOrgEmail(null)}
        onNavigateOrg={setActiveOrgEmail}
      />

      <StoryViewer
        key={archiveOrgEmail ?? "archive-story-closed"}
        orgs={orgsWithArchive}
        postsByOrg={archivedByOrg}
        orderedEmails={archiveOrderedEmails}
        activeOrgEmail={archiveOrgEmail}
        onClose={() => setArchiveOrgEmail(null)}
        onNavigateOrg={setArchiveOrgEmail}
      />
    </>
  );
}
