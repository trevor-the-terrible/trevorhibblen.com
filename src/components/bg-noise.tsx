import { cn } from "@/lib/utils"

export function BgNoise({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute top-0 left-0 z-[-1]',
        'w-full h-full',
        'bg-repeat',
        'bg-[url("/src/assets/bgpx2.webp")]',
        'opacity-20',
        className,
      )}
    >
    </div>
  )
}

export default BgNoise;
