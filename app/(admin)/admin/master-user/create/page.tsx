import FormMasterUser from "@/components/form/form-master-user";
import { Card } from "@/components/ui/card";

export default function CreateMasterUserPage() {
  return (
    <Card className="h-[96vh] rounded-md bg-transparent">
      <FormMasterUser />
    </Card>
  );
}
