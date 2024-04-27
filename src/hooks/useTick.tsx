// More or less adapted from farcebook's useAnimation
import { useCallback, useEffect, useRef } from "react";
export const TargetFPS = 10;

export function useTick(callback: (dt: number) => void, stop?: boolean) {
    const frameRef = useRef(-1);
    const previousTimeRef = useRef(0);
    const deltaRef = useRef(0);

    const animate = useCallback(
        (time: number) => {
            const dt = (time - previousTimeRef.current) / 1000; // Delta time in seconds
            deltaRef.current += dt;
            if (deltaRef.current > 1 / TargetFPS) {
                callback(deltaRef.current);
                deltaRef.current = 0;
            }
            previousTimeRef.current = time;
            frameRef.current = requestAnimationFrame(animate);
        },
        [callback]
    );

    useEffect(() => {
        if (stop) {
            cancelAnimationFrame(frameRef.current);
            previousTimeRef.current = 0;
        } else {
            frameRef.current = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(frameRef.current);
    }, [animate, stop]);
}