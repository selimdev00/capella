import { getUserTodos } from "@/lib/api/users";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export async function UserTodos({ id }: { id: number }) {
  let todos;
  try {
    todos = await getUserTodos(id);
  } catch {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Couldn&apos;t load todos. Please try again later.
      </p>
    );
  }

  if (todos.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        This user has no todos.
      </p>
    );
  }

  const done = todos.filter((t) => t.completed).length;

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        {done} of {todos.length} completed
      </p>
      <ul className="divide-y rounded-lg border">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-3 p-3">
            {todo.completed ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            ) : (
              <Circle className="text-muted-foreground size-4 shrink-0" />
            )}
            <span
              className={cn(
                "text-sm",
                todo.completed && "text-muted-foreground line-through",
              )}
            >
              {todo.todo}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
