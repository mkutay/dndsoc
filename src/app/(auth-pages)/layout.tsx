export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="lg:max-w-6xl max-w-prose flex flex-col mx-auto px-4 lg:my-12 mt-6 mb-12">{children}</div>;
}
