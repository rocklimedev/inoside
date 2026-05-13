import { Card } from "@/components/ui/card";
import { formatCompactINR } from "@/lib/format";

export function BoqSummary({ totals, itemCount }) {
  return (
    <Card className="p-6 bg-gradient-to-r from-slate-50 to-white border-primary/20">
      <h3 className="font-semibold mb-4">BOQ Summary</h3>

      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="text-2xl font-bold mt-1">
            {formatCompactINR(totals.subtotal)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tax</p>
          <p className="text-2xl font-bold mt-1">
            {formatCompactINR(totals.tax_amount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">
            Grand Total
          </p>
          <p className="text-3xl font-bold text-primary mt-1">
            {formatCompactINR(totals.grand_total)}
          </p>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-4">
        {itemCount} items • Ready to submit
      </div>
    </Card>
  );
}
