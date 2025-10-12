// 📍 src/app/(dashboard)/huespedes/layout.tsx
export default function HuespedesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
}