import { useRef, useState, useCallback } from 'react';

export function useDraggableScroll(ref: React.RefObject<HTMLElement | null>) {
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        // Prevent drag if clicking on a button, input, or reservation (assuming reservations have specific classes or standard drag behavior)
        // We will assume that if standard DnD is triggered, this might be interrupted, or we can filter by target.
        // For now, let's allow it unless it's explicitly an interactive element we know of.
        // Better: let the user pass a filter or check if defaultPrevented.

        // If the user clicks on a reservation (which is draggable), we might not want to scroll.
        // Reservations usually result in a 'dragstart' event.
        if ((e.target as HTMLElement).closest('[draggable="true"]')) {
            return;
        }

        if (ref.current) {
            setIsDragging(true);
            startX.current = e.pageX - ref.current.offsetLeft;
            startScrollLeft.current = ref.current.scrollLeft;

            // Allow text selection? Usually no during drag scroll
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';
        }
    }, [ref]);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !ref.current) return;

        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX.current) * 1.5; // Multiplier for speed
        ref.current.scrollLeft = startScrollLeft.current - walk;
    }, [isDragging, ref]);

    const onMouseLeave = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }
    }, [isDragging]);

    return {
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onMouseLeave,
        isDragging
    };
}
