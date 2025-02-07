import { Card } from "@/components/ui/card";
import { FeaturesForm } from "../../_components/features-form";


export default async function FeaturesPage() {
  return (
    <Card className="p-6">
      <FeaturesForm />
    </Card>
  );
}
