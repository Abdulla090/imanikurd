import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    type?: "error" | "offline" | "empty";
}

export function ErrorState({
    title = "هەڵەیەک ڕوویدا",
    message = "تکایە دووبارە هەوڵ بدەوە",
    onRetry,
    type = "error",
}: ErrorStateProps) {
    const Icon = type === "offline" ? WifiOff : AlertCircle;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
        >
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    دووبارە هەوڵدان
                </Button>
            )}
        </motion.div>
    );
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    message?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center glass-card rounded-2xl"
        >
            {icon && (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
            {message && (
                <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
            )}
            {action}
        </motion.div>
    );
}

interface LoadingStateProps {
    message?: string;
}

export function LoadingState({ message = "چاوەڕوان بە..." }: LoadingStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
        >
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-muted" />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-muted-foreground mt-4">{message}</p>
        </motion.div>
    );
}
