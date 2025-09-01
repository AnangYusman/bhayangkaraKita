import StaticPageBuilderEdit from "@/components/form/static-page/static-page-edit-form";
import { Card } from "@/components/ui/card";

export default function StaticPageEdit() {
  return (
    <Card className="rounded-md bg-transparent p-4 overflow-auto">
      <StaticPageBuilderEdit />
    </Card>
  );
}
