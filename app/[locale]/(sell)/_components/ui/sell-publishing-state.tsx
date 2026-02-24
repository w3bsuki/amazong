import { CloudUpload as CloudArrowUp, LoaderCircle as SpinnerGap } from "lucide-react";

type SellPublishingStateProps = {
  title: string;
  description: string;
  waitLabel: string;
};

export function SellPublishingState({ title, description, waitLabel }: SellPublishingStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-border border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CloudArrowUp className="size-10 text-primary animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="text-muted-foreground font-medium">{description}</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
          <SpinnerGap className="size-4 animate-spin" />
          <span>{waitLabel}</span>
        </div>
      </div>
    </div>
  );
}
