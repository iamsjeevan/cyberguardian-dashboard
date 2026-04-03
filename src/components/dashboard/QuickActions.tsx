import { Play, Square, FlaskConical, RefreshCw } from "lucide-react";
import { useStartTraining, useStopTraining, useRunEvaluation } from "@/hooks/useApiData";
import { useAppStore } from "@/stores/appStore";

export function QuickActions() {
  const { isTraining, setIsTraining } = useAppStore();
  const startMutation = useStartTraining();
  const stopMutation = useStopTraining();
  const evalMutation = useRunEvaluation();

  const handleStart = () => {
    setIsTraining(true);
    startMutation.mutate();
  };
  const handleStop = () => {
    setIsTraining(false);
    stopMutation.mutate();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <ActionBtn icon={Play} label="START TRAINING" variant="primary" onClick={handleStart} disabled={isTraining} />
      <ActionBtn icon={Square} label="STOP" variant="destructive" onClick={handleStop} disabled={!isTraining} />
      <ActionBtn icon={FlaskConical} label="RUN EVALUATION" variant="default" onClick={() => evalMutation.mutate()} />
      <ActionBtn icon={RefreshCw} label="REBUILD KG" variant="default" />
    </div>
  );
}

function ActionBtn({ icon: Icon, label, variant = "default", onClick, disabled }: {
  icon: React.ComponentType<{ size?: number | string }>;
  label: string;
  variant?: "primary" | "destructive" | "default";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30",
    destructive: "bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30",
    default: "bg-surface-elevated text-muted-foreground border-border hover:bg-accent",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-30 ${styles[variant]}`}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}
