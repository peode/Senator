import { Skeleton } from "@/components/ui/skeleton";

const AdminListSkeleton = () => (
  <div className="flex flex-col gap-4">
    {[1, 2, 3].map((key) => (
      <Skeleton key={key} className="h-20 rounded-2xl" />
    ))}
  </div>
);

export default AdminListSkeleton;
