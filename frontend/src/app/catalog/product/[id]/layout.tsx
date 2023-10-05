export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <main className="absolute w-screen h-screen max-h-full block">
      {children}
    </main>
  );
}
