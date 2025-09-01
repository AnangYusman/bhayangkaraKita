import FormMasterUserEdit from "@/components/form/form-master-user-edit";
import { Card } from "@/components/ui/card";

export default function CreateMasterUserPage() {
  return (
    <Card className="h-[96vh] rounded-md bg-transparent">
      <FormMasterUserEdit />
    </Card>
  );
}
