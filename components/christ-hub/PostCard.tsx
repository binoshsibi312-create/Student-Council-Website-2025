import type { ChristHubPost } from "@/lib/christ-hub/types";
import { christHubMediaUrl, formatRelativeTime, orgInitials } from "@/lib/christ-hub/format";
import { CATEGORY_STYLE } from "@/lib/christ-hub/category";
import { hoursRemaining } from "@/lib/christ-hub/expiry";

export default function PostCard({
  post,
  logoFileId,
  onOpenOrg,
}: {
  post: ChristHubPost;
  logoFileId?: string;
  onOpenOrg: (email: string) => void;
}) {
  const style = CATEGORY_STYLE[post.category];
  const mediaUrl = christHubMediaUrl(post.driveFileId);
  const logoUrl = christHubMediaUrl(logoFileId);
  const remaining = hoursRemaining(post.timestamp);

  return (
    <div className="bg-white border border-line rounded-card-md overflow-hidden transition-all duration-250 hover:border-gold hover:shadow-card-sm">
      <button
        className="flex items-center gap-2.5 p-4 pb-3 w-full text-left cursor-pointer"
        onClick={() => onOpenOrg(post.orgEmail)}
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-ink-2 text-white/90 font-display text-[0.8rem] font-medium overflow-hidden">
          {logoUrl ? <img src={logoUrl} alt="" className="w-full h-full object-cover" /> : orgInitials(post.orgName)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[0.9rem] font-semibold text-ink truncate">{post.orgName}</span>
          <span className="block text-[0.7rem] text-text-muted">{formatRelativeTime(post.timestamp)}</span>
        </span>
        <span className="shrink-0 text-[0.62rem] font-medium text-text-muted whitespace-nowrap">
          {remaining > 0 ? `expires in ${remaining}h` : "expiring"}
        </span>
      </button>

      {post.mediaType !== "none" && (
        <div className="w-full aspect-[4/3] relative flex items-end p-4" style={{ background: style.gradient }}>
          {mediaUrl && post.mediaType === "video" ? (
            <video src={mediaUrl} className="absolute inset-0 w-full h-full object-cover" controls muted preload="metadata" />
          ) : mediaUrl ? (
            <img src={mediaUrl} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          ) : null}
          <span
            className="relative text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-white/85"
            style={mediaUrl ? { textShadow: "0 1px 6px rgba(0,0,0,0.6)" } : undefined}
          >
            {!mediaUrl && "Poster · "}
            {post.category}
          </span>
        </div>
      )}

      <div className="p-4 pt-3.5">
        {post.mediaType === "none" && (
          <span className={`inline-block text-[0.62rem] font-semibold tracking-[0.05em] uppercase py-0.5 px-2 rounded-full mb-2.5 ${style.pill}`}>
            {post.category}
          </span>
        )}
        <p className="text-[0.86rem] text-text-secondary leading-[1.6] font-light mb-3">{post.caption}</p>

        {(post.registrationUrl || post.videoUrl) && (
          <div className="flex flex-wrap gap-2">
            {post.registrationUrl && (
              <a
                href={post.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[0.76rem] font-semibold text-ink bg-gold/15 py-1.5 px-3 rounded-full hover:bg-gold/25 transition-colors"
              >
                Register →
              </a>
            )}
            {post.videoUrl && (
              <a
                href={post.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[0.76rem] font-semibold text-steel bg-steel/10 py-1.5 px-3 rounded-full hover:bg-steel/20 transition-colors"
              >
                ▶ Watch video
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
