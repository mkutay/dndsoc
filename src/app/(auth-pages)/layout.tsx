export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lg:max-w-6xl max-w-prose flex flex-col mx-auto px-4 my-12">
      {children}
    </div>
  );
}
