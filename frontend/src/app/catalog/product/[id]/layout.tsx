export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <main className="w-full h-full">{children}</main>;
}
