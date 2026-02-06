import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted/50",
                className
            )}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="feature-card">
            <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        </div>
    );
}

export function SurahCardSkeleton() {
    return (
        <div className="feature-card flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );
}

export function AyahSkeleton() {
    return (
        <div className="verse-card space-y-6">
            <div className="flex justify-center">
                <Skeleton className="w-14 h-14 rounded-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4 mx-auto" />
            </div>
            <div className="flex justify-center gap-4 my-6">
                <Skeleton className="h-px w-12" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-px w-12" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6 mx-auto" />
            </div>
        </div>
    );
}

export function HadithSkeleton() {
    return (
        <div className="feature-card space-y-4">
            <div className="flex items-start gap-3">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                </div>
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <div className="flex items-center gap-3 my-4">
                <Skeleton className="h-px flex-1" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-px flex-1" />
            </div>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
        </div>
    );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: count }).map((_, i) => (
                <SurahCardSkeleton key={i} />
            ))}
        </div>
    );
}
