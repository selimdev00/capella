import { getUserPosts } from "@/lib/api/users";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export async function UserPosts({ id }: { id: number }) {
  let posts;
  try {
    posts = await getUserPosts(id);
  } catch {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Couldn&apos;t load posts. Please try again later.
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        This user has no posts.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li key={post.id} className="rounded-lg border p-4">
          <p className="font-medium">{post.title}</p>
          <p className="text-muted-foreground mt-1 text-sm">{post.body}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {post.reactions ? (
              <span className="text-muted-foreground ml-auto flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="size-3.5" />
                  {post.reactions.likes}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsDown className="size-3.5" />
                  {post.reactions.dislikes}
                </span>
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
